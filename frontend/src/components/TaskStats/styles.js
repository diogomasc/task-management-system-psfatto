import styled from "styled-components";

export const StatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
  padding: 0.5rem 0;
  color: #555;
`;

export const StatItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.9rem;

  span {
    font-weight: 600;
    color: #1a365d;
    margin-left: 0.5rem;
    background-color: ${(props) => (props.isHighValue ? "#dbeafe" : "#dcfce7")};
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
  }
`;
