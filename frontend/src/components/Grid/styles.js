import styled from "styled-components";

export const GridContainer = styled.div`
  width: 100%;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin: 0 auto;
`;

export const TaskRow = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: ${(props) => (props.$value >= 1000 ? "#fff3cd" : "white")};
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
  touch-action: none;
  width: 100%;
  box-sizing: border-box;

  &:hover {
    background-color: ${(props) =>
      props.$value >= 1000 ? "#ffe7b3" : "#f9f9f9"};
  }
`;

export const TaskInfo = styled.div`
  flex: 1;
`;

export const TaskDescription = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #333;
`;

export const TaskDetails = styled.p`
  margin: 0;
  color: #666;
  font-size: 0.9rem;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const IconButton = styled.button`
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: ${(props) => props.$color || "#666"};
  opacity: ${(props) => (props.$disabled ? 0.5 : 1)};
  pointer-events: ${(props) => (props.$disabled ? "none" : "auto")};

  &:hover {
    color: ${(props) => props.$hoverColor || "#333"};
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

export const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: auto;
  margin-top: 1rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #45a049;
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

export const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

export const DeleteDialog = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 300px;
`;

export const DialogButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

export const DialogButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${(props) => (props.$primary ? "#dc3545" : "#f5f5f5")};
  color: ${(props) => (props.$primary ? "white" : "#666")};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => (props.$primary ? "#c82333" : "#e8e8e8")};
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
