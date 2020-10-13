import React from 'react';
import { getAllTickets, addNewTicket, getTicketType, getIssuedBy } from '../Services/TicketAPI';
import SideNav from '../SideNav/SideNav';
import axios from "axios";
import {
    Form,
    Input,
    Button,
    Select,
    DatePicker,
    Checkbox
} from 'antd';
import Autosuggest from "react-autosuggest";
import * as moment from "moment";

export default class EditTicket extends React.Component {

    state = {
        ticketData: [],
        ticketDataChecked: false,
        Id: '',
        TicketTypeId: '',
        Expiry: '',
        TicketId: '',
        IssuedById: '',
        IssuedOn: '',
        UserId: '',
        FrontPictureUrl: '',
        BackPictureUrl: '',
        CreatedBy: '',
        DateCreated: '',
        ModifiedBy: '',
        DateModified: '',
        PublicTicket: '',
        ticketType: [],
        value: "",
        suggestions: [],
        nameID: [],
        inputAttributes: false,
        changeFrontPic: false,
        changeBackPic: false,
        editTicketId: false,
        editTypeValue: false,
        editDates: false,
        editDateExpiry: false
    }

    componentDidMount() {
        var ticketArray = [];
        getTicketType().then(res => {
            this.setState({ ticketType: res.data.data })
        }).catch(err => {
            console.log('err => ', err);
        })
        getAllTickets().then(res => {
            res.data.data.map(tickets => (
                ticketArray.push(tickets.id)
            ))
            const paramId = this.props.match.params.id
            if (ticketArray.includes(parseInt(paramId, 10))) {
                res.data.data.filter(x => {
                    if (x.id === parseInt(paramId, 10)) {
                        console.log('x.issuedOn => ', moment(x.issuedOn).format('YYYY-MM-DD'))
                        this.setState({ ticketData: x, ticketDataChecked: x.publicTicket })
                        return false
                    }
                    console.log('this.state.ticketData => ', this.state.ticketDataChecked);

                })
            } else {
                console.log('false');
            }
        }).catch(err => {
            console.log('err => ', err);
        })
    }

    autosuggest = () => {
        this.setState({ inputAttributes: true })
        if (this.state.inputAttributes === true) {
            this.setState({ inputAttributes: false })
        } else {
            this.setState({ inputAttributes: true })
        }
    }

    changeHandler = (event) => {
        console.log('event => ', event.target.value)
        this.setState({
            [event.target.name]: event.target.value
        });
        console.log('thtis.state.TicketId => ', this.state.TicketId);

    }

    handleChange = (value) => {
        console.log('value => ', value);
        this.setState({ TicketTypeId: value })
        console.log('this.state.TicketTypeId => ', this.state.TicketTypeId);


    }

    sendNewTicket = () => {
        const formData = new FormData()
        formData.append('Id', this.state.ticketData.id)
        formData.append('TicketTypeId', this.state.TicketTypeId)
        formData.append('Expiry', moment(this.state.Expiry).format())
        formData.append('TicketId', this.state.TicketId)
        formData.append('IssuedById', this.state.IssuedById)
        formData.append('IssuedOn', moment(this.state.IssuedOn).format())
        formData.append('UserId', 17)
        formData.append('FrontPictureUrl', `https://biappstoragetest.blob.core.windows.net/tickets/48/${this.state.FrontPictureUrl}`)
        formData.append('BackPictureUrl', `https://biappstoragetest.blob.core.windows.net/tickets/48/${this.state.BackPictureUrl}`)
        formData.append('CreatedBy', 0)
        formData.append('DateCreated', moment(new Date()).format())
        formData.append('ModifiedBy', 0)
        formData.append('DateModified', moment(new Date()).format())
        formData.append('PublicTicket', this.state.PublicTicket)
        addNewTicket(formData).then(res => {
            console.log('res => ', res);
            if (res.status === true) {
                this.setState({
                    Id: '',
                    TicketTypeId: '',
                    Expiry: '',
                    TicketId: '',
                    IssuedById: '',
                    IssuedOn: '',
                    UserId: '',
                    FrontPictureUrl: '',
                    BackPictureUrl: '',
                    CreatedBy: '',
                    DateCreated: '',
                    ModifiedBy: '',
                    DateModified: '',
                    PublicTicket: ''
                })
            }
        }).catch(err => {
            console.log('err => ', err);
        });
    }

    getSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        return inputLength === 0 ? [] : this.state.suggestions.filter(city =>
            city.toLowerCase().slice(0, inputLength) === inputValue);
    };

    getSuggestionValue = suggestion => suggestion;

    renderSuggestion = suggestion => (
        <div>
            {suggestion}
        </div>
    );

    onChange = (event, { newValue }) => {
        let finalArry = [];
        let finalID = [];
        this.setState({
            value: newValue
        }, async () => {
            try {
                const resp = await axios.get(`https://bimiscwebapi-test.azurewebsites.net/api/companies/GetCompanies/${this.state.value}`)
                console.log('resp => ', resp);
                resp.data.data.map(name => {
                    finalID.push(name);
                    finalArry.push(name.name)
                })
                this.setState({ suggestions: finalArry, nameID: finalID });

            } catch (err) {
                event.preventDefault();
            }
        });
    };

    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            suggestions: this.getSuggestions(this.state.value)
        });
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    onSuggestionSelected = (event, { suggestion, suggestionValue, index, method }) => {
        event.preventDefault();
        this.state.nameID.map(id => {
            if (suggestion === id.name) {
                this.setState({ IssuedById: id.id })
            }
        })
    }

    changePicture = (value) => {
        if (value === 'front_pic') {
            this.setState({ changeFrontPic: true })
        } else if (value === 'back_pic') {
            this.setState({ changeBackPic: true })

        }
    }

    fileChangedHandler = (event) => {
        console.log('event.target.files[0] => ', event.target.files);

        this.setState({ FrontPictureUrl: event.target.files[0].name })
    }

    backPictureHandler = (event) => {

        this.setState({ BackPictureUrl: event.target.files[0].name })
    }

    getCheckBoxValue = (e) => {
        console.log('e => ', e);

        this.setState({ PublicTicket: e })
    }

    datePicketExpiry = (date, dateString) => {
        console.log('datePicketExpiry', date, dateString);
        this.setState({ Expiry: moment(date._d).format('MM-DD-YYYY') })

    }

    datePickerIssuedOn = (date, dateString) => {
        console.log('datePickerIssuedOn', date, dateString);
        this.setState({ IssuedOn: moment(date._d).format('MM-DD-YYYY') })
    }

    editTicketID = () => {
        this.setState({ editTicketId: true })
        if (this.state.editTicketId === true) {
            this.setState({ editTicketId: false })

        } else {
            this.setState({ editTicketId: true })
        }
    }

    changeType = () => {
        this.setState({ editTypeValue: true })
        if (this.state.editTypeValue === true) {
            this.setState({ editTypeValue: false })

        } else {
            this.setState({ editTypeValue: true })
        }
    }

    editDatePicker = () => {

        this.setState({ editDates: true })

        if (this.state.editDates === true) {
            this.setState({ editDates: false })

        } else {
            this.setState({ editDates: true })
        }
    }

    editDateForExpiry = () => {
        this.setState({ editDateExpiry: true })

        if (this.state.editDateExpiry === true) {
            this.setState({ editDateExpiry: false })

        } else {
            this.setState({ editDateExpiry: true })
        }
    }
    render() {

        const onFinishFailed = (errorInfo) => {
            console.log("Failed:", errorInfo);
        };

        const { value, suggestions } = this.state;

        const inputProps = {
            placeholder: "Enter Post Code",
            value,
            onChange: this.onChange,
        };
        return (
            <div>
                <SideNav />
                <div className="index-main">
                    <div className="edit-sec mt-80"><h2>Add Tickets</h2></div>
                    <div className="addticketform ml-4">
                        <div className="form-border p-4 w-30 mt-5 crd-wrap">
                            <Form name="basic" className="card-body"
                                initialValues={{ remember: true }}
                                onFinish={() => this.sendNewTicket()}
                                onFinishFailed={onFinishFailed}>
                                <div className="form-group">
                                    <div className="dropdown dd-type">
                                        <label className="form-label">Type</label><i className="fa fa-edit" onClick={() => this.changeType()}></i>

                                        {!this.state.editTypeValue ?
                                            <Select value={this.state.ticketData.ticketType ? this.state.ticketData.ticketType : this.state.TicketTypeId} className="form-ant-control" onChange={(e) => this.handleChange(e)} placeholder="Please select a ticket type">

                                            </Select> :

                                            <Select className="form-ant-control" onChange={(e) => this.handleChange(e)} placeholder="Please select a ticket type">
                                                {
                                                    this.state.ticketType.map(ticketDetails => (
                                                        <Select.Option value={ticketDetails.id}>{ticketDetails.name}</Select.Option>
                                                    ))
                                                }
                                            </Select>
                                        }
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Issued On</label><i className="fa fa-edit" onClick={() => this.editDatePicker()}></i>

                                    {!this.state.editDates ?

                                        <DatePicker value={moment(moment(this.state.ticketData.issuedOn).format('YYYY-MM-DD'), ('YYYY-MM-DD'))} onChange={(event) => this.datePickerIssuedOn(event)} /> :
                                        <DatePicker onChange={(event) => this.datePickerIssuedOn(event)} />

                                    }
                                </div>
                                <div className="form-group">
                                    <label>Expiry</label><i className="fa fa-edit" onClick={() => this.editDateForExpiry()}></i>
                                    {!this.state.editDateExpiry ?

                                        <DatePicker value={moment(moment(this.state.ticketData.expiry).format('YYYY-MM-DD'), ('YYYY-MM-DD'))} onChange={(event) => this.datePicketExpiry(event)} name="Expiry" /> :
                                        <DatePicker onChange={(event) => this.datePicketExpiry(event)} name="Expiry" />}
                                </div>
                                <div className="form-group">
                                    <label>Ticket Id</label>
                                    <i className="fa fa-edit" onClick={() => this.editTicketID()}></i>
                                    {this.state.editTicketId ? <Form.Item
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please enter ticket Id!"
                                            }]}>
                                        <Input name="TicketId" onChange={(e) => this.changeHandler(e)} />
                                    </Form.Item> :
                                        <input type="text" className="form-control" id="TicketId" aria-describedby="nameHelp" value={this.state.ticketData.ticketType} />
                                    }
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-lg-6">
                                        <label for="issuedby">Issued By</label>
                                        <i className="fa fa-edit" onClick={() => this.autosuggest()}></i>
                                        {this.state.inputAttributes ? <Autosuggest
                                            suggestions={suggestions}
                                            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                            getSuggestionValue={this.getSuggestionValue}
                                            renderSuggestion={this.renderSuggestion}
                                            onSuggestionSelected={this.onSuggestionSelected}
                                            inputProps={inputProps}
                                        /> : <input type="text" className="form-control" id="TicketId" aria-describedby="nameHelp" value={this.state.ticketData.issuedBy} />}
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-lg-6 img-upload-btn">
                                        <label for="img"><span className="mr-2"><i className="fas fa-upload"></i></span> Front Picture </label><i className="fa fa-edit" onClick={() => this.changePicture('front_pic')}> </i>
                                        {!this.state.changeFrontPic ? <> <img src={this.state.ticketData.frontPictureUrl} alt="Front Picture" /> </> : <><input type="file" id="img" name="img" accept="image/*" className="img-upload" onChange={(e) => this.fileChangedHandler(e)} /> </>}
                                    </div>
                                    <div className="form-group col-lg-6 img-upload-btn">
                                        <label for="img2"><span className="mr-2"><i className="fas fa-upload"></i></span> Back Picture</label><i className="fa fa-edit" onClick={() => this.changePicture('back_pic')}> </i>
                                        {!this.state.changeBackPic ? <><img src={this.state.ticketData.backPictureUrl} alt="Back Picture" /> </> : <> <input type="file" id="img2" name="img2" accept="image/*" className="img-upload" onChange={(e) => this.backPictureHandler(e)} /> </>}
                                    </div>
                                </div>
                                <p>{this.state.ticketDataChecked}</p>
                                <div className="form-check">
                                    <Checkbox
                                        checked={
                                            this.state.ticketDataChecked
                                                ? true
                                                : false
                                        }
                                        onChange={(e) => this.getCheckBoxValue(e.target.checked)}>
                                        Public Ticket
                                     </Checkbox>
                                    {/* <input className="form-check-input" type="checkbox" id="defaultCheck1" name="PublicTicket" checked={this.state.ticketData.publicTicket} onChange={(e) => this.getCheckBoxValue(e.target.checked)} />
                                    <label className="form-check-label" for="defaultCheck1">Public Ticket</label> */}
                                </div>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" className="login-submit mt-5">Update Ticket</Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}