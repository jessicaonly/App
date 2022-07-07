import _ from 'underscore';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import React from 'react';
import {withNetwork} from './OnyxProvider';
import Icon from './Icon';
import * as Expensicons from './Icon/Expensicons';
import RenderHTML from './RenderHTML';
import TextLink from './TextLink';
import Text from './Text';
import colors from '../styles/colors';
import compose from '../libs/compose';
import OfflineIndicator from './OfflineIndicator';
import networkPropTypes from './networkPropTypes';
import styles from '../styles/styles';
import withLocalize, {withLocalizePropTypes} from './withLocalize';

const propTypes = {
    /** Wrapped child components */
    children: PropTypes.node.isRequired,

    /** Styles for container element */
    containerStyles: PropTypes.arrayOf(PropTypes.object),

    /** Whether to show the alert text */
    isAlertVisible: PropTypes.bool.isRequired,

    /** Whether message is in html format */
    isMessageHtml: PropTypes.bool,

    /** Error message to display above button */
    message: PropTypes.string,

    /** Props to detect online status */
    network: networkPropTypes.isRequired,

    /** Callback fired when the "fix the errors" link is pressed */
    onFixTheErrorsPressed: PropTypes.func,

    ...withLocalizePropTypes,
};

const defaultProps = {
    containerStyles: [],
    isMessageHtml: false,
    message: '',
    onFixTheErrorsPressed: () => {},
};

// The FormAlertWrapper offers a standardized way of showing error messages and offline functionality.
//
// This component takes other components as a child prop. It will then render any wrapped components as a function using "render props",
// and passes it a (bool) isOffline parameter. Child components can then use the isOffline variable to determine offline behavior.
const FormAlertWrapper = (props) => {
    function getAlertPrompt() {
        let error = '';

        if (!_.isEmpty(props.message)) {
            if (props.isMessageHtml) {
                error = (
                    <RenderHTML html={`<muted-text>${props.message}</muted-text>`} />
                );
            } else {
                error = (
                    <Text style={styles.mutedTextLabel}>{props.message}</Text>
                );
            }
        } else {
            error = (
                <>
                    <Text style={styles.mutedTextLabel}>
                        {`${props.translate('common.please')} `}
                    </Text>
                    <TextLink
                        style={styles.label}
                        onPress={props.onFixTheErrorsPressed}
                    >
                        {props.translate('common.fixTheErrors')}
                    </TextLink>
                    <Text style={styles.mutedTextLabel}>
                        {` ${props.translate('common.inTheFormBeforeContinuing')}.`}
                    </Text>
                </>
            );
        }

        return (
            <View style={[styles.flexRow, styles.ml2, styles.flexWrap, styles.flex1]}>
                {error}
            </View>
        );
    }

    return (
        <View style={[styles.mh5, styles.mb5, styles.flex1, styles.justifyContentEnd, ...props.containerStyles]}>
            {props.isAlertVisible && (
                <View style={[styles.flexRow, styles.alignItemsCenter, styles.mb3]}>
                    <Icon src={Expensicons.Exclamation} fill={colors.red} />
                    {getAlertPrompt()}
                </View>
            )}
            {props.children(props.network.isOffline)}
            {props.network.isOffline && <OfflineIndicator />}
        </View>
    );
};

FormAlertWrapper.propTypes = propTypes;
FormAlertWrapper.defaultProps = defaultProps;
FormAlertWrapper.displayName = 'FormAlertWrapper';

export default compose(
    withLocalize,
    withNetwork(),
)(FormAlertWrapper);
