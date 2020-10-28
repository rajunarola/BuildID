import React from 'react'
import { addNewTicket, getTicketType } from '../Services/TicketAPI';
import SideNav from '../SideNav/SideNav';
import { Form, Input, Select, DatePicker, notification } from 'antd';
import axios from "axios";
import Autosuggest from "react-autosuggest";
import * as moment from "moment"
export default class AddNewTickets extends React.Component {

    state = {
        Id: 0,
        TicketTypeId: '',
        Expiry: moment(new Date()),
        TicketId: '',
        IssuedById: '',
        IssuedOn: moment(new Date()),
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
        nameID: []
    }

    componentDidMount() {
        getTicketType().then(res => {
            this.setState({ ticketType: res.data.data })
        }).catch(err => {
            console.log('err => ', err);
        })
    }


    changeHandler = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleChange = (value) => {
        this.setState({ TicketTypeId: value })
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

    fileChangedHandler = (event, value) => {
        if (value === 'front_picture') {
            this.setState({ FrontPictureUrl: event.target.files[0].name })
        } else if (value === 'back_picture') {
            this.setState({ BackPictureUrl: event.target.files[0].name })
        }
    }

    getCheckBoxValue = (e) => {
        this.setState({ PublicTicket: e })
    }

    datePickerExpiry = (date) => {
        this.setState({ Expiry: date })
    }
    datePickerIssuedOn = (date) => {
        this.setState({ IssuedOn: date })
    }

    render() {

        const onFinishFailed = (errorInfo) => {
            console.log("Failed:", errorInfo);
        };

        const { value, suggestions } = this.state;

        const inputProps = {
            placeholder: "Enter Ticket Type",
            value,
            onChange: this.onChange
        };

        const sendNewTicket = () => {
            const formData = new FormData()
            formData.append('Id', this.state.Id)
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
                if (res.data.status === true) {
                    this.setState({
                        Id: 0,
                        TicketTypeId: '',
                        Expiry: moment(new Date()),
                        TicketId: '',
                        IssuedById: '',
                        IssuedOn: moment(new Date()),
                        UserId: '',
                        FrontPictureUrl: '',
                        BackPictureUrl: '',
                        CreatedBy: '',
                        DateCreated: '',
                        ModifiedBy: '',
                        DateModified: '',
                        PublicTicket: '',
                        suggestions: [],
                        nameID: [],
                        value: ''
                    });
                    notification.open({
                        message: 'Success',
                        description: 'Ticket successfully added!'
                    });
                }
            }).catch(err => {
                notification.open({
                    message: 'Error',
                    description: 'There was an error while adding new Ticket!'
                });
            });
        }

        return (

            <div>
                <SideNav />
                <div className="index-main">
                    <div className="edit-sec mt-80"><h2>Add Tickets</h2></div>
                    <div className="addticketform ml-4">
                        <div className="form-border p-4 w-30 mt-5 crd-wrap">
                            <Form className="card-body"
                                onFinish={sendNewTicket}
                                onFinishFailed={onFinishFailed}>
                                <div className="form-group">
                                    <div className="dropdown dd-type">
                                        <label className="form-label formlabel">Type</label>
                                        <Select value={this.state.TicketTypeId} className="form-ant-control w-100 inputstyle" onChange={(e) => this.handleChange(e)} placeholder="Please select a ticket type">
                                            {
                                                this.state.ticketType.map(ticketDetails => (
                                                    <Select.Option value={ticketDetails.id}>{ticketDetails.name}</Select.Option>
                                                ))
                                            }
                                        </Select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="formlabel">Issued On</label>
                                    <DatePicker value={moment(this.state.IssuedOn)} className="w-100 inputstyle" onChange={this.datePickerIssuedOn} name="IssuedOn" />
                                </div>
                                <div className="form-group">
                                    <label className="formlabel">Expiry</label>
                                    <DatePicker value={moment(this.state.Expiry)} className="w-100 inputstyle" onChange={this.datePickerExpiry} name="Expiry" />
                                </div>
                                <div className="form-group">
                                    <label className="formlabel">Ticket Id</label>
                                    <Form.Item
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please enter ticket Id!"
                                            }]}>
                                        <Input value={this.state.TicketId} className="w-100 inputstyle" name="TicketId" onChange={(e) => this.changeHandler(e)} />
                                    </Form.Item>
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-lg-12 autsuggest-input">
                                        <label for="issuedby">Issued By</label>
                                        <Autosuggest
                                            suggestions={suggestions}
                                            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                            getSuggestionValue={this.getSuggestionValue}
                                            renderSuggestion={this.renderSuggestion}
                                            onSuggestionSelected={this.onSuggestionSelected}
                                            inputProps={inputProps}
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-lg-6 img-upload-btn">
                                        <label for="img"><span className="mr-2"><i className="fas fa-upload"></i></span> Front Picture
                                         <input type="file" id="img" name="img" accept="image/*" className="img-upload" onChange={(e) => this.fileChangedHandler(e, 'front_picture')} />
                                        </label>
                                    </div>
                                    <div className="form-group col-lg-6 img-upload-btn">
                                        <label for="img2"><span className="mr-2"><i className="fas fa-upload"></i></span> Back Picture
                                        <input type="file" id="img2" name="img2" accept="image/*" className="img-upload" onChange={(e) => this.fileChangedHandler(e, 'back_picture')} />
                                        </label>
                                    </div>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="defaultCheck1" name="PublicTicket" checked={this.state.PublicTicket} onChange={(e) => this.getCheckBoxValue(e.target.checked)} />
                                    <label className="form-check-label" for="defaultCheck1">Public Ticket</label>
                                </div>
                                <button type="submit" className="btn btn-blue login-submit mt-5">Add New Ticket</button>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}
