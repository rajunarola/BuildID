import React, { Component } from 'react';
import { getAllTickets, addNewTicket, getTicketType, getIssuedBy, getTicketByID } from '../Services/TicketAPI';
import Autosuggest from "react-autosuggest";
import * as moment from "moment";
import axios from "axios";

import SideNav from '../SideNav/SideNav';
import {
    Form,
    Input,
    Select,
    DatePicker,
    notification
} from 'antd';
export default class EditTicketFinal extends Component {

    state = {
        Id: '',
        TicketTypeId: '',
        Expiry: '',
        TicketId: '',
        IssuedBy: '',
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
        ChangeTicketId: [],
        value: '',
        suggestions: [],
        inputAttributes: false,
        nameID: []
    }

    componentDidMount() {
        getTicketType().then(res => {
            this.setState({ ChangeTicketId: res.data.data })
        }).catch(err => {
            notification.open({
                message: 'Error',
                description: 'There was an error while fetching ticket type!'
            });
        })
        const paramId = this.props.match.params.id
        getTicketByID(paramId).then(res => {
            this.setState({
                Id: res.data.data.id,
                TicketTypeId: res.data.data.ticketTypeId,
                Expiry: res.data.data.expiry,
                TicketId: res.data.data.ticketId,
                IssuedBy: res.data.data.issuedBy,
                IssuedById: res.data.data.issuedById,
                IssuedOn: res.data.data.issuedOn,
                UserId: res.data.data.userId ? res.data.data.userId : localStorage.getItem('userID'),
                FrontPictureUrl: res.data.data.frontPictureUrl,
                BackPictureUrl: res.data.data.backPictureUrl,
                CreatedBy: res.data.data.createdBy,
                DateCreated: res.data.data.dateCreated,
                ModifiedBy: res.data.data.modifiedBy,
                DateModified: res.data.data.dateModified,
                PublicTicket: res.data.data.publicTicket
            });
        }).catch(err => {
            notification.open({
                message: 'Error',
                description: 'There was an error while updating ticket!'
            });
        })
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

    handleChange = (value) => {
        this.setState({ TicketTypeId: value })
    }

    datePickerExpiry = (date) => {
        this.setState({ Expiry: moment(date._d).format('MM-DD-YYYY') })
    }

    datePickerIssuedOn = (date) => {
        this.setState({ IssuedOn: moment(date._d).format('MM-DD-YYYY') })
    }

    changeHandler = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    onChange = (event, { newValue }) => {
        let finalArry = [];
        this.setState({
            value: newValue
        }, async () => {
            try {
                const resp = await axios.get(`https://bimiscwebapi-test.azurewebsites.net/api/companies/GetCompanies/${this.state.value}`)
                resp.data.data.map(name => {
                    finalArry.push(name.name)
                })
                this.setState({ suggestions: finalArry });
            } catch (err) {
                event.preventDefault();
            }
        });
    };

    getCheckBoxValue = (e) => {
        this.setState({ PublicTicket: e })
    }

    frontPictureHandler = (event) => {
        this.setState({ FrontPictureUrl: event.target.files[0].name })
    }

    backPictureHandler = (event) => {
        this.setState({ BackPictureUrl: event.target.files[0].name })
    }


    autosuggest = () => {
        this.setState({ inputAttributes: true })
        if (this.state.inputAttributes === true) {
            this.setState({ inputAttributes: false })
        } else {
            this.setState({ inputAttributes: true })
        }
    }

    sendNewTicket = () => {
        const formData = new FormData()
        formData.append('Id', this.state.Id)
        formData.append('TicketTypeId', this.state.TicketTypeId ? this.state.TicketTypeId : this.state.ticketData.ticketType)
        formData.append('Expiry', moment(this.state.Expiry).format())
        formData.append('TicketId', this.state.TicketId)
        formData.append('IssuedById', this.state.IssuedById)
        formData.append('IssuedOn', moment(this.state.IssuedOn).format())
        formData.append('UserId', this.state.UserId)
        formData.append('FrontPictureUrl', this.state.FrontPictureUrl)
        formData.append('BackPictureUrl', this.state.BackPictureUrl)
        formData.append('CreatedBy', this.state.CreatedBy)
        formData.append('DateCreated', moment(new Date()).format())
        formData.append('ModifiedBy', this.state.ModifiedBy)
        formData.append('DateModified', moment(new Date()).format())
        formData.append('PublicTicket', this.state.PublicTicket)
        addNewTicket(formData).then(res => {
            if (res.data.status === true) {
                notification.open({
                    message: 'Success',
                    description: 'Ticket successfully updated!'
                });
            }
        }).catch(err => {
            notification.open({
                message: 'Error',
                description: 'There was an error while updating ticket!'
            });
        });
    }

    render() {

        const { value, suggestions } = this.state;

        const inputProps = {
            placeholder: "Enter Ticket Type",
            value,
            onChange: this.onChange,
        };

        const onFinishFailed = (errorInfo) => {
            console.log("Failed:", errorInfo);
        };

        return (
            <div>
                <SideNav />
                <div className="index-main">
                    <div className="edit-sec mt-80"><h2>Edit Ticket</h2></div>
                    <div className="addticketform ml-4">
                        <div className="form-border p-4 w-30 mt-5 crd-wrap">
                            <Form name="basic" className="card-body"
                                initialValues={{ remember: true }}
                                onFinish={() => this.sendNewTicket()}
                                onFinishFailed={onFinishFailed}>
                                <div className="form-group">
                                    <div className="dropdown dd-type">
                                        <label className="form-label formlabel">Type</label>
                                        <Select className="form-ant-control w-100 inputstyle" value={this.state.TicketTypeId} onChange={(e) => this.handleChange(e)} placeholder="Please select a ticket type">
                                            {
                                                this.state.ChangeTicketId.map(ticketDetails => (
                                                    <Select.Option value={ticketDetails.id}>{ticketDetails.name}</Select.Option>
                                                ))
                                            }
                                        </Select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="formlabel">Issued On</label>
                                    <DatePicker className="w-100 inputstyle" value={moment(moment(this.state.IssuedOn).format('YYYY-MM-DD'), ('YYYY-MM-DD'))} onChange={(event) => this.datePickerIssuedOn(event)} name="IssuedOn" />
                                </div>
                                <div className="form-group">
                                    <label className="formlabel">Expiry</label>
                                    <DatePicker className="w-100 inputstyle" value={moment(moment(this.state.Expiry).format('YYYY-MM-DD'), ('YYYY-MM-DD'))} onChange={(event) => this.datePickerExpiry(event)} name="Expiry" />
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
                                        <Input className="w-100 inputstyle" value={this.state.TicketId} name="TicketId" onChange={(e) => this.changeHandler(e)} />
                                    </Form.Item>
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-lg-12 autsuggest-input">
                                        <label for="issuedby">Issued By</label>
                                        <div className="position-relative">
                                            {this.state.inputAttributes ?
                                                <Autosuggest
                                                    suggestions={suggestions}
                                                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                                    getSuggestionValue={this.getSuggestionValue}
                                                    renderSuggestion={this.renderSuggestion}
                                                    onSuggestionSelected={this.onSuggestionSelected}
                                                    inputProps={inputProps}
                                                />
                                                : <input type="text" className="form-control pr-5" id="TicketId" aria-describedby="nameHelp" value={this.state.IssuedBy} />}
                                            <i className="fa fa-edit autsuggest-edit" title="Please click on edit to enter value" onClick={() => this.autosuggest()}></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-lg-6 img-upload-btn">
                                        <label for="img"><span className="mr-2"><i className="fas fa-upload"></i></span> Front Picture
                                        {this.state.FrontPictureUrl !== "" ?
                                                <>
                                                    <img src={this.state.FrontPictureUrl} alt="ImageFront" className="mt-2 mb-2 d-block" />
                                                    <input type="file" id="img" name="img" accept="image/*" className="img-upload" onChange={(e) => this.frontPictureHandler(e)} />
                                                </> :
                                                <input type="file" id="img" name="img" accept="image/*" className="img-upload" onChange={(e) => this.frontPictureHandler(e)} />
                                            }
                                        </label>
                                    </div>
                                    <div className="form-group col-lg-6 img-upload-btn">
                                        <label for="img2"><span className="mr-2"><i className="fas fa-upload"></i></span> Back Picture
                                        {this.state.BackPictureUrl !== '' ?
                                                <>
                                                    <img src={this.state.BackPictureUrl} alt="ImageBack" className="mt-2 mb-2 d-block" />
                                                    <input type="file" id="img2" name="img2" accept="image/*" className="img-upload" onChange={(e) => this.backPictureHandler(e)} />
                                                </> :
                                                <input type="file" id="img2" name="img2" accept="image/*" className="img-upload" onChange={(e) => this.backPictureHandler(e)} />
                                            }
                                        </label>
                                    </div>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="defaultCheck1" name="PublicTicket" onChange={(e) => this.getCheckBoxValue(e.target.checked)} />
                                    <label className="form-check-label" for="defaultCheck1">Public Ticket</label>
                                </div>
                                <button type="submit" className="btn btn-blue login-submit mt-5">Update Ticket</button>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
