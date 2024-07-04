import * as API from '@libs/API';
import type ConnectPolicyToSageIntacctParams from '@libs/API/parameters/ConnectPolicyToSageIntacctParams';
import {WRITE_COMMANDS} from '@libs/API/types';
import * as ErrorUtils from '@libs/ErrorUtils';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import type {Connections} from '@src/types/onyx/Policy';
import type {OnyxUpdate} from 'react-native-onyx';
import Onyx from 'react-native-onyx';

type SageIntacctCredentials = {companyID: string; userID: string; password: string};

function connectToSageIntacct(policyID: string, credentials: SageIntacctCredentials) {
    const parameters: ConnectPolicyToSageIntacctParams = {
        policyID,
        intacctCompanyID: credentials.companyID,
        intacctUserID: credentials.userID,
        intacctPassword: credentials.password,
    };
    API.write(WRITE_COMMANDS.CONNECT_POLICY_TO_SAGE_INTACCT, parameters, {});
}

function prepareOnyxData(policyID: string, settingName: keyof Connections['intacct']['config'], settingValue: string | boolean | null) {
    const optimisticData: OnyxUpdate[] = [
        {
            onyxMethod: Onyx.METHOD.MERGE,
            key: `${ONYXKEYS.COLLECTION.POLICY}${policyID}`,
            value: {
                connections: {
                    intacct: {
                        config: {
                            [settingName]: settingValue,
                            pendingFields: {
                                [settingName]: CONST.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                            },
                            errorFields: {
                                [settingName]: null,
                            },
                        },
                    },
                },
            },
        },
    ];

    const failureData: OnyxUpdate[] = [
        {
            onyxMethod: Onyx.METHOD.MERGE,
            key: `${ONYXKEYS.COLLECTION.POLICY}${policyID}`,
            value: {
                connections: {
                    intacct: {
                        config: {
                            [settingName]: settingValue,
                            pendingFields: {
                                [settingName]: null,
                            },
                            errorFields: {
                                [settingName]: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
                            },
                        },
                    },
                },
            },
        },
    ];

    const successData: OnyxUpdate[] = [
        {
            onyxMethod: Onyx.METHOD.MERGE,
            key: `${ONYXKEYS.COLLECTION.POLICY}${policyID}`,
            value: {
                connections: {
                    intacct: {
                        config: {
                            [settingName]: settingValue,
                            pendingFields: {
                                [settingName]: null,
                            },
                            errorFields: {
                                [settingName]: null,
                            },
                        },
                    },
                },
            },
        },
    ];

    return {optimisticData, failureData, successData};
}

function prepareSyncOnyxData(policyID: string, settingName: keyof Connections['intacct']['config']['sync'], settingValue: string | boolean | null) {
    const optimisticData: OnyxUpdate[] = [
        {
            onyxMethod: Onyx.METHOD.MERGE,
            key: `${ONYXKEYS.COLLECTION.POLICY}${policyID}`,
            value: {
                connections: {
                    intacct: {
                        config: {
                            sync: {
                                [settingName]: settingValue,
                                pendingFields: {
                                    [settingName]: CONST.RED_BRICK_ROAD_PENDING_ACTION.UPDATE,
                                },
                                errorFields: {
                                    [settingName]: null,
                                },
                            },
                        },
                    },
                },
            },
        },
    ];

    const failureData: OnyxUpdate[] = [
        {
            onyxMethod: Onyx.METHOD.MERGE,
            key: `${ONYXKEYS.COLLECTION.POLICY}${policyID}`,
            value: {
                connections: {
                    intacct: {
                        config: {
                            sync: {
                                [settingName]: settingValue,
                                pendingFields: {
                                    [settingName]: null,
                                },
                                errorFields: {
                                    [settingName]: ErrorUtils.getMicroSecondOnyxErrorWithTranslationKey('common.genericErrorMessage'),
                                },
                            },
                        },
                    },
                },
            },
        },
    ];

    const successData: OnyxUpdate[] = [
        {
            onyxMethod: Onyx.METHOD.MERGE,
            key: `${ONYXKEYS.COLLECTION.POLICY}${policyID}`,
            value: {
                connections: {
                    intacct: {
                        config: {
                            sync: {
                                [settingName]: settingValue,
                                pendingFields: {
                                    [settingName]: null,
                                },
                                errorFields: {
                                    [settingName]: null,
                                },
                            },
                        },
                    },
                },
            },
        },
    ];

    return {optimisticData, failureData, successData};
}

function updateSageIntacctAutoSync(policyID: string, enabled: boolean) {
    const {optimisticData, failureData, successData} = prepareOnyxData(policyID, CONST.SAGE_INTACCT_CONFIG.IS_AUTO_SYNC_ENABLED, enabled);
    const parameters = {
        policyID,
        connectionName: CONST.POLICY.CONNECTIONS.NAME.SAGE_INTACCT,
        settingName: CONST.SAGE_INTACCT_CONFIG.IS_AUTO_SYNC_ENABLED,
        settingValue: JSON.stringify(enabled),
        idempotencyKey: CONST.SAGE_INTACCT_CONFIG.IS_AUTO_SYNC_ENABLED,
    };

    API.write(WRITE_COMMANDS.UPDATE_POLICY_CONNECTION_CONFIG, parameters, {optimisticData, failureData, successData});
}

function updateSageIntacctImportEmployees(policyID: string, enabled: boolean) {
    const {optimisticData, failureData, successData} = prepareOnyxData(policyID, CONST.SAGE_INTACCT_CONFIG.IMPORT_EMPLOYEES, enabled);
    const parameters = {
        policyID,
        connectionName: CONST.POLICY.CONNECTIONS.NAME.SAGE_INTACCT,
        settingName: CONST.SAGE_INTACCT_CONFIG.IMPORT_EMPLOYEES,
        settingValue: JSON.stringify(enabled),
        idempotencyKey: CONST.SAGE_INTACCT_CONFIG.IMPORT_EMPLOYEES,
    };

    API.write(WRITE_COMMANDS.UPDATE_POLICY_CONNECTION_CONFIG, parameters, {optimisticData, failureData, successData});
}

function updateSageIntacctApprovalMode(policyID: string, enabled: boolean) {
    const approvalModeSettingValue = enabled ? CONST.SAGE_INTACCT.APPROVAL_MODE.APPROVAL_MANUAL : null;
    const {optimisticData, failureData, successData} = prepareOnyxData(policyID, CONST.SAGE_INTACCT_CONFIG.APPROVAL_MODE, approvalModeSettingValue);
    const parameters = {
        policyID,
        connectionName: CONST.POLICY.CONNECTIONS.NAME.SAGE_INTACCT,
        settingName: CONST.SAGE_INTACCT_CONFIG.APPROVAL_MODE,
        settingValue: JSON.stringify(approvalModeSettingValue),
        idempotencyKey: CONST.SAGE_INTACCT_CONFIG.APPROVAL_MODE,
    };

    API.write(WRITE_COMMANDS.UPDATE_POLICY_CONNECTION_CONFIG, parameters, {optimisticData, failureData, successData});
}

function updateSageIntacctSyncReimbursedReports(policyID: string, vendorID: string | boolean) {
    const settingValue = vendorID ?? false;
    const {optimisticData, failureData, successData} = prepareSyncOnyxData(policyID, CONST.SAGE_INTACCT_CONFIG.SYNC_REIMBURSED_REPORTS, settingValue);
    const parameters = {
        policyID,
        connectionName: CONST.POLICY.CONNECTIONS.NAME.SAGE_INTACCT,
        settingName: CONST.SAGE_INTACCT_CONFIG.SYNC_REIMBURSED_REPORTS,
        settingValue: JSON.stringify(settingValue),
        idempotencyKey: CONST.SAGE_INTACCT_CONFIG.SYNC_REIMBURSED_REPORTS,
    };

    API.write(WRITE_COMMANDS.UPDATE_POLICY_CONNECTION_CONFIG, parameters, {optimisticData, failureData, successData});
}

function updateSageIntacctSyncReimbursementAccountID(policyID: string, vendorID: string | null) {
    const {optimisticData, failureData, successData} = prepareSyncOnyxData(policyID, CONST.SAGE_INTACCT_CONFIG.REIMBUSERED_ACCOUNT_ID, vendorID);
    const parameters = {
        policyID,
        connectionName: CONST.POLICY.CONNECTIONS.NAME.SAGE_INTACCT,
        settingName: CONST.SAGE_INTACCT_CONFIG.REIMBUSERED_ACCOUNT_ID,
        settingValue: JSON.stringify(vendorID),
        idempotencyKey: CONST.SAGE_INTACCT_CONFIG.REIMBUSERED_ACCOUNT_ID,
    };

    API.write(WRITE_COMMANDS.UPDATE_POLICY_CONNECTION_CONFIG, parameters, {optimisticData, failureData, successData});
}

export {connectToSageIntacct, updateSageIntacctAutoSync, updateSageIntacctImportEmployees, updateSageIntacctApprovalMode, updateSageIntacctSyncReimbursedReports, updateSageIntacctSyncReimbursementAccountID};
