import styled, { injectGlobal } from 'styled-components';

import { COLORS } from './variables';

export const EXPLICIT_GLOBALS = injectGlobal`
  body {
    font-family: 'PT Sans';
    background: ${COLORS.LIGHT};
  }
`;

export const Content = styled.div`
  display: flex;
  padding: 16px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const SectionTitle = styled.h2`
  color: ${COLORS.DARK};
  font-size: 1.5rem;
  margin-bottom: 8px;
`;

export const LoginPrompt = styled.div`
  width: 50%;
  background: ${COLORS.SECONDARY};
  color: ${COLORS.WHITE};
  border-radius: 24px;
  text-align: center;
  font-size: 3rem;
  margin-top: 12px;
  padding: 24px;

  @media (max-width: 600px) {
    width: auto;
  }
`;

export const GenericButton = styled.button`
  padding: .5rem 1rem;
  color: ${COLORS.WHITE};
  border: 4px solid ${COLORS.SECONDARY};
  border-width: ${props => props.squared && '0px'};
  border-radius: 4px;
  border-radius: ${props => props.squared && '0px'};
  background: ${COLORS.SECONDARY};
  transition: all 350ms;
  cursor: pointer;

  &:hover,
  &:focus {
    background: ${COLORS.PRIMARY};
    color: ${COLORS.WHITE};
    outline: none;
  }
`;

export const WarningButton = GenericButton.extend`
  &:hover,
  &:focus {
    background: ${COLORS.WARNING};
    border-color: ${COLORS.WHITE};
  }
`;

export const HeaderBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  background: ${COLORS.PRIMARY};
  color: ${COLORS.LIGHT};
  padding: 16px;
`;

export const UserControls = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

export const UserName = styled.div`
  margin-right: 8px;
`;

export const LoginStateButton = styled.button`
`;

export const MessageForm = styled.form`
  display: flex;
  width: 60%;
  flex-direction: column;
  margin-bottom: 16px;
  padding: 16px;
  background: ${COLORS.WHITE};

  @media (max-width: 600px) {
    width: 100%;
  }
`;

export const MessageFormLabel = styled.label`
  background: ${COLORS.SECONDARY};
  padding: 4px 8px;
`;

export const MessageFormInput = styled.input`
  text-align: left;
  background: ${COLORS.LIGHT};
  border: 0 solid ${COLORS.PRIMARY};
  margin-bottom: 8px;
  font-size: 1rem;
  width: calc(100% - 1rem);
  padding: .5rem;
`;

export const MessagePreview = styled.div`
  padding: 16px 12px;
  margin: 8px 0 16px;
  background: ${COLORS.LIGHT};
  border-radius: 8px;
  text-align: center;
`;

export const MessagePreviewTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 8px;
  color: ${COLORS.PRIMARY}
`;

export const MessagePreviewText = styled.p`
  margin-bottom: 8px;
  word-wrap: break-word;
`;

export const QueuedMessageList = styled.div`
  width: 100%;
`;

export const QueuedMessage = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 8px;
  background: ${COLORS.CAUTION};
  background: ${props => props.sending && COLORS.WARNING};
  background: ${props => props.sent && COLORS.SUCCESS};
  transition: all 1s;

  @media (max-width: 600px) {
    flex-direction: column-reverse;
  }
`;

export const MessageInformation = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  flex: 1;
  padding: 8px 8px 0;
`;

export const QueuedMessageText = styled.div`
  background: ${COLORS.LIGHT};
  flex-basis: fill;
  flex: 1;
  flex-basis: 100%;
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 8px;
  text-align: center;
`;

export const QueuedMessageCaption = styled.div`
  color: ${COLORS.LIGHT};
  margin-bottom: 8px;
`;

export const WarningsContainer = styled.div`
  display: ${props => (props.active ? 'flex' : 'none')};
  justify-content: space-between;
  flex-wrap: wrap;
  background: ${COLORS.WARNING};
  color: ${COLORS.WHITE};
  padding: 16px;
  margin-bottom: 16px;
  text-align: center;
`;
