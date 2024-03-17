import gql from 'graphql-tag';

export interface WalletResType {
    success: boolean;
    message?: string;
    data?: any;
}

export const WalletResTypeFragment = gql`
    fragment WalletResTypeFragment on ResType {
        success
        message
        data
    }
`;
