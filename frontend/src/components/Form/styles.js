import styled from "styled-components";

export const FormContainer = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 400px;
`;

export const Title = styled.h2`
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.5rem;
`;

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

export const LabelContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`;

export const Label = styled.label`
  color: #555;
  font-size: 0.9rem;
  font-weight: 500;
  margin-right: 1rem;
`;

export const CharCounter = styled.span`
  font-size: 0.8rem;
  font-weight: 400;
  color: ${(props) => (props.$isLimit ? "#dc2626" : "#6b7280")};
  transition: color 0.2s ease;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  background-color: "#fff";
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #4caf50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
  }

  &::placeholder {
    color: #aaa;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 2rem;
`;

export const Button = styled.button`
  padding: 0.65rem 1.25rem;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${(props) => (props.$primary ? "#4CAF50" : "#f5f5f5")};
  color: ${(props) => (props.$primary ? "white" : "#666")};

  &:hover {
    background-color: ${(props) => (props.$primary ? "#45a049" : "#e8e8e8")};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

export const ErrorMessage = styled.span`
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 0.4rem;
  display: block;
`;
