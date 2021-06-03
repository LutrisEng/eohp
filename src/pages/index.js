import * as React from "react";
import PropTypes from 'prop-types';
import { graphql, Link } from "gatsby";

const IndexPage = ({ data }) => {
  return (
    <main>
      {data.allPartsYaml.nodes.map(part => (
        <div>
          <h2><Link to={`/parts/${part.partNumber.toLowerCase()}`}>
            {part.partNumber}
          </Link></h2>
          <p>{part.description}</p>
        </div>
      ))}
    </main>
  );
};

IndexPage.propTypes = {
  data: PropTypes.shape({
    allPartsYaml: PropTypes.shape({
      nodes: PropTypes.arrayOf(PropTypes.shape({
        partNumber: PropTypes.string,
        description: PropTypes.string,
      })),
    }),
  }).isRequired,
};

export default IndexPage;

export const query = graphql`
  query {
    allPartsYaml {
      nodes {
        partNumber
        description
      }
    }
  }
`;