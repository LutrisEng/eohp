const fetch = require('node-fetch');
const cheerio = require('cheerio');

const NODE_TYPE = 'MouserPart';

async function fetchPart(key, cache, sku) {
  const cacheKey = `${NODE_TYPE}-${sku}`;
  const cached = await cache.get(cacheKey);
  if (cached) {
    return cached;
  }
  const res = await fetch(`https://api.mouser.com/api/v1/search/partnumber?apiKey=${key}`, {
    method: 'POST',
    body: JSON.stringify({
      SearchByPartRequest: {
        mouserPartNumber: sku,
      }
    }),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });
  const results = await res.json();
  const parts = results.SearchResults.Parts.map(part => ({
    availability: part.Availability,
    datasheet: part.DataSheetUrl,
    description: part.Description,
    factoryStock: part.FactoryStock,
    imagePath: part.ImagePath,
    category: part.Category,
    leadTime: part.LeadTime,
    lifecycleStatus: part.LifecycleStatus,
    manufacturer: part.Manufacturer,
    manufacturerPartNumber: part.ManufacturerPartNumber,
    min: part.Min,
    mult: part.Mult,
    sku: part.MouserPartNumber,
    productAttributes: (part.productAttributes || []).map(x => ({
      name: x.AttributeName,
      value: x.AttributeValue,
    })),
    priceBreaks: (part.PriceBreaks || []).map(x => ({
      quantity: x.Quantity,
      price: x.Price,
      currency: x.Currency,
    })),
    alternatePackagings: (part.AlternatePackagings || []).map(x => ({
      apMfrPn: x.APMfrPN,
    })),
    url: part.ProductDetailUrl,
    reeling: part.Reeling,
    rohs: part.ROHSStatus,
    suggestedReplacement: part.SuggestedReplacement,
    multiSimBlue: part.MultiSimBlue,
    unitWeightKg: (part.UnitWeightKg || {}).UnitWeight,
    standardCost: (part.StandardCost || {}).Standardcost,
    discontinued: part.IsDiscontinued,
    rtm: part.RTM,
    category: part.MouserProductCategory,
    ipc: part.IPCCode,
    sField: part.SField,
    vNum: part.VNum,
    actualManufacturerName: part.ActualMfrName,
    availableOnOrder: part.AvailableOnOrder,
    infoMessages: part.InfoMessages,
    restriction: part.RestrictionMessage,
    pid: part.PID,
    productCompliance: (part.ProductCompliance || []).map(x => ({
      name: x.ComplianceName,
      value: x.ComplianceValue,
    })),
  }));
  await cache.set(cacheKey, parts);
  return parts;
}

exports.sourceNodes = async (params, { parts, key }) => {
  const {
    actions: { createNode },
    createContentDigest,
    createNodeId,
    cache,
  } = params;
  const partData = (await Promise.all(parts.map(x => fetchPart(key, cache, x)))).flat();

  for (const part of partData) {
    createNode({
      ...part,
      id: createNodeId(`${NODE_TYPE}-${part.sku}`),
      parent: null,
      children: [],
      internal: {
        type: NODE_TYPE,
        content: JSON.stringify(part),
        contentDigest: createContentDigest(part),
      },
    });
  }
};