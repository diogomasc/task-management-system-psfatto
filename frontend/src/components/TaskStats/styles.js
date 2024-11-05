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
    font-weight: 500;
    color: #2563eb;
    margin-left: 0.5rem;
  }
`;
