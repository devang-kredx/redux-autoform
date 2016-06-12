import React, {Component, PropTypes} from 'react';
import LiveSchemaEditorForm from './LiveSchemaEditorForm';
import presets from '../presets';
import _ from 'underscore';
import psjon from '../../package.json';
import AutoForm from '../../src/AutoForm';
import DefaultComponentFactory from '../../src/DefaultComponentFactory';
import {Alert, Button, Checkbox, Glyphicon} from 'react-bootstrap';
import moment from 'moment';
import numbro from 'numbro';
import reactWidgetsMomentLocalizer from 'react-widgets/lib/localizers/moment';
import momentLocalizer from '../../src/lib/localization/momentDateLocalizer';
import numbroLocalizer from '../../src/lib/localization/numbroNumberLocalizer';
import ButtonToolbar from './ButtonToolbar';

class LiveSchemaEditor extends Component {

    getAutoFormProps(metaForm, formName) {
        if (!formName) throw Error('Form name cannot be empty');
        if (!metaForm)
            return undefined;
        return {
            form: formName,
            buttonBar: ButtonToolbar,
            schema: eval('(' + metaForm.schema.value + ')'),
            entityName: metaForm.entityName.value,
            layoutName: metaForm.layoutName.value,
            componentFactory: DefaultComponentFactory,
            errorRenderer: this.errorRenderer,
            onSubmit: (...args) => {
                console.log(args);
            }
        };
    }

    /**
     * Renders an exception box
     * @param ex
     * @returns {XML}
     */
    errorRenderer(ex) {
        return <Alert bsStyle='danger'>
            <h4>Oh snap! The configuration is not valid.</h4>
            <p>Detailed information:
                <b>{ex.message}</b>
            </p>
        </Alert>;
    }

    render() {

        // setting date localizer
        reactWidgetsMomentLocalizer(moment);
        momentLocalizer(moment);

        // setting number localizer
        numbroLocalizer(numbro);

        let {reduxFormActions, preset} = this.props;
        preset = preset || 'default';
        let presetObject = _.find(presets, p => p.name == preset);
        if (!presetObject) throw Error(`Could not find preset. Preset name: ${preset}`);
        let autoFormProps;
        let autoForm;
        try {
            autoFormProps = this.getAutoFormProps(this.props.metaForm, preset);
            autoForm = autoFormProps ? <AutoForm {...autoFormProps} /> : null;
        } catch (ex) {
            autoForm = this.errorRenderer(ex);
        }

        return <div className="live-schema-editor">
            <div className='row'>
                <div className="col-md-12">
                    <h2>Redux-autoform demo {psjon.version}
                        <a className="pull-right" target="_blank" href="https://github.com/gearz-lab/redux-autoform" style={{color: 'black'}}>
                            <i className="fa fa-github" aria-hidden="true" />
                        </a>
                    </h2>
                </div>
                <div className="col-md-5">
                    <LiveSchemaEditorForm reduxFormActions={reduxFormActions} selectedPreset={preset}
                                          initialValues={presetObject}/>
                </div>
                <div className="col-md-7">
                    <div className="row" style={{ marginBottom: '10px'}}>
                        <div className="col-md-12">

                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="live-schema-editor-mount-node">
                                {autoForm}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    }
}

LiveSchemaEditor.propTypes = {
    preset: PropTypes.string
};

export default LiveSchemaEditor;