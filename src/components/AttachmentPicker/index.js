import React from 'react';
import propTypes from './AttachmentPickerPropTypes';

/**
 * This component renders a function as a child and
 * returns a "show attachment picker" method that takes
 * a callback. This is the web/mWeb/desktop version since
 * on a Browser we must append a hidden input to the DOM
 * and listen to onChange event.
 */
class AttachmentPicker extends React.Component {
    render() {
        return (
            <>
                <input
                    hidden
                    type="file"
                    accept="audio/*;video/*;image/*;application/pdf"
                    ref={el => this.fileInput = el}
                    onChange={(e) => {
                        const file = e.target.files[0];

                        if (file) {
                            file.uri = URL.createObjectURL(file);
                            this.onPicked(file);
                        }

                        // Cleanup after selecting a file to start from a fresh state
                        this.fileInput.value = null;
                    }}
                />
                {this.props.children({
                    openPicker: ({onPicked}) => {
                        this.onPicked = onPicked;
                        this.fileInput.click();
                    },
                })}
            </>
        );
    }
}

AttachmentPicker.propTypes = propTypes;
export default AttachmentPicker;
