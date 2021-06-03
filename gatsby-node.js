exports.createSchemaCustomization = ({ actions: { createTypes } }) => {
  const typeDefs = `
    type PartsYamlBom implements Node {
      mouser: MouserPart @link(by: "sku")
    }
  `;
  createTypes(typeDefs)
}