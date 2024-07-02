import {ExpensiMark} from 'expensify-common';
import Onyx from 'react-native-onyx';
import ONYXKEYS from '@src/ONYXKEYS';

const reportIDToNameMap: Record<string, string> = {};
const accountIDToNameMap: Record<string, string> = {};

Onyx.connect({
    key: ONYXKEYS.COLLECTION.REPORT,
    callback: (report) => {
        if (!report) {
            return;
        }

        reportIDToNameMap[report.reportID] = report.reportName ?? report.displayName ?? report.reportID;
    },
});

Onyx.connect({
    key: ONYXKEYS.PERSONAL_DETAILS_LIST,
    callback: (personalDetailsList) => {
        Object.values(personalDetailsList ?? {}).forEach((personalDetails) => {
            if (!personalDetails) {
                return;
            }

            accountIDToNameMap[personalDetails.accountID] = personalDetails.login ?? String(personalDetails.accountID);
        });
    },
});

type Extras = {
    reportIDToName?: Record<string, string>;
    accountIDToName?: Record<string, string>;
    cacheVideoAttributes?: (vidSource: string, attrs: string) => void;
    videoAttributeCache?: Record<string, string>;
};

class ExpensiMarkWithContext extends ExpensiMark {
    htmlToMarkdown(htmlString: string, extras?: Extras): string {
        return super.htmlToMarkdown(htmlString, {
            reportIDToName: extras?.reportIDToName ?? reportIDToNameMap,
            accountIDToName: extras?.accountIDToName ?? accountIDToNameMap,
            cacheVideoAttributes: extras?.cacheVideoAttributes,
        });
    }

    htmlToText(htmlString: string, extras?: Extras): string {
        return super.htmlToText(htmlString, {
            reportIDToName: extras?.reportIDToName ?? reportIDToNameMap,
            accountIDToName: extras?.accountIDToName ?? accountIDToNameMap,
            cacheVideoAttributes: extras?.cacheVideoAttributes,
        });
    }
}

const Parser = new ExpensiMarkWithContext();

export default Parser;
