// SPDX-License-Identifier: GPL-3.0+

import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';

const Part = ({ data }) => (
  <>
    <main>
      <h1>{data.partsYaml.partNumber}</h1>
      {data.partsYaml.description}
      <pre><code>{JSON.stringify(data, null, 2)}</code></pre>
    </main>
  </>
);

Part.propTypes = {
  data: PropTypes.shape({
    partsYaml: PropTypes.shape({
      partNumber: PropTypes.string,
      description: PropTypes.string,
      bom: PropTypes.arrayOf(PropTypes.shape({
        mouser: PropTypes.shape({
          imagePath: PropTypes.string,
          description: PropTypes.string,
          manufacturerPartNumber: PropTypes.string,
          sku: PropTypes.string,
        }),
      })),
      versions: PropTypes.arrayOf(PropTypes.shape({
        cid: PropTypes.string,
        filename: PropTypes.string,
        format: PropTypes.string,
        timestamp: Date,
      })),
    }),
  }).isRequired,
};

export default Part;

export const query = graphql`
  query($partNumber: String) {
    partsYaml(partNumber: { eq: $partNumber }) {
      partNumber
      description
      bom {
        mouser {
          imagePath
          description
          manufacturerPartNumber
          sku
        }
      }
      versions {
        cid
        filename
        format
        timestamp
      }
    }
  }
`;