import styled, { injectGlobal } from 'styled-components';

import { COLORS } from './variables';
import { baseUnits } from './methods';

export const EXPLICIT_GLOBALS = injectGlobal`
  body {
    font-family: 'PT Sans';
    background: ${COLORS.LIGHT};
  }
`;

export const Content = styled.div`
  display: flex;
  padding: ${baseUnits(4)};
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const SectionTitle = styled.h2`
  color: ${COLORS.DARK};
  font-size: 1.5rem;
  margin-bottom: ${baseUnits(2)};
`;

export const LoginPrompt = styled.div`
  width: 50%;
  background: ${COLORS.SECONDARY};
  color: ${COLORS.WHITE};
  border-radius: ${baseUnits(6)};
  text-align: center;
  font-size: 3rem;
  margin-top: ${baseUnits(3)};
  padding: ${baseUnits(6)};

  @media (max-width: 600px) {
    width: auto;
  }
`;

export const GenericButton = styled.button`
  padding: .5rem 1rem;
  color: ${COLORS.WHITE};
  border: ${baseUnits(1)} solid ${COLORS.SECONDARY};
  border-width: ${props => props.squared && '0px'};
  border-radius: ${baseUnits(1)};
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

// TODO: Would ideally use `GenericButton.extend` but that creates
// issues with react SSR/CSR hash matching (on dev builds). See:
// https://github.com/styled-components/babel-plugin-styled-components/issues/52
export const WarningButton = styled(GenericButton)`
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
  padding: ${baseUnits(4)};
`;

export const UserControls = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

export const UserName = styled.div`
  margin-right: ${baseUnits(2)};
`;

export const LoginStateButton = styled.button`
`;

export const MessageForm = styled.form`
  display: flex;
  width: 60%;
  flex-direction: column;
  margin-bottom: ${baseUnits(4)};
  padding: ${baseUnits(4)};
  background: ${COLORS.WHITE};

  @media (max-width: 600px) {
    width: 100%;
  }
`;

export const MessageFormLabel = styled.label`
  background: ${COLORS.SECONDARY};
  padding: 4px ${baseUnits(2)};
`;

export const MessageFormInput = styled.input`
  text-align: left;
  background: ${COLORS.LIGHT};
  border: 0 solid ${COLORS.PRIMARY};
  margin-bottom: ${baseUnits(2)};
  font-size: 1rem;
  width: calc(100% - 1rem);
  padding: .5rem;
`;

export const MessagePreview = styled.div`
  padding: ${baseUnits(4)} ${baseUnits(3)};
  margin: ${baseUnits(2)} 0 ${baseUnits(4)};
  background: ${COLORS.LIGHT};
  border-radius: ${baseUnits(2)};
  text-align: center;
`;

export const MessagePreviewTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: ${baseUnits(2)};
  color: ${COLORS.PRIMARY}
`;

export const MessagePreviewText = styled.p`
  margin-bottom: ${baseUnits(2)};
  word-wrap: break-word;
`;

export const QueuedMessageList = styled.div`
  width: 100%;
`;

export const QueuedMessage = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: ${baseUnits(2)};
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
  padding: ${baseUnits(2)} ${baseUnits(2)} 0;
`;

export const QueuedMessageText = styled.div`
  background: ${COLORS.LIGHT};
  flex-basis: fill;
  flex: 1;
  flex-basis: 100%;
  padding: ${baseUnits(2)};
  margin-bottom: ${baseUnits(2)};
  border-radius: ${baseUnits(2)};
  text-align: center;
`;

export const QueuedMessageCaption = styled.div`
  color: ${COLORS.LIGHT};
  margin-bottom: ${baseUnits(2)};
`;

export const WarningsContainer = styled.div`
  display: ${props => (props.active ? 'flex' : 'none')};
  justify-content: space-between;
  flex-wrap: wrap;
  background: ${COLORS.WARNING};
  color: ${COLORS.WHITE};
  padding: ${baseUnits(4)};
  margin-bottom: ${baseUnits(4)};
  text-align: center;
`;
