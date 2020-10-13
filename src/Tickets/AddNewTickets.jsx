import React from 'react'
import { addNewTicket, getTicketType, getIssuedBy } from '../Services/TicketAPI';
import SideNav from '../SideNav/SideNav';
import {
    Form,
    Input,
    Button,
    Select,
    DatePicker
} from 'antd';
import axios from "axios";
import Autosuggest from "react-autosuggest";
import * as moment from "moment";


export default class AddNewTickets extends React.Component {

    state = {
        Id: 0,
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
        nameID: []
    }

    componentDidMount() {
        getTicketType().then(res => {
            console.log('res => ', res);
            this.setState({ ticketType: res.data.data })
        }).catch(err => {
            console.log('err => ', err);
        })
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
    }

    sendNewTicket = () => {
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
            console.log('res => ', res);
            if (res.status === true) {
                this.setState({
                    Id: 0,
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

    getSearchStringData(e) {
        getIssuedBy(e.target.value).then(res => {
            console.log('res => ', res);
            this.setState({ searchedData: res.data.data })
        }).catch(err => {
            console.log('err => ', err);
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
        console.log('ping... ', suggestion, index)
        this.state.nameID.map(id => {
            if (suggestion === id.name) {
                console.log('id.id => ', id.id);
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

    datePickerExpiry = (date, value) => {
        if (value === 'expiry') {
            this.setState({ Expiry: moment(date._d).format('MM-DD-YYYY') })
        } else if (value === 'issued_on') {
            this.setState({ IssuedOn: moment(date._d).format('MM-DD-YYYY') })
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
                                        <label className="form-label">Type</label>
                                        <Select className="form-ant-control" onChange={(e) => this.handleChange(e)} placeholder="Please select a ticket type">
                                            {
                                                this.state.ticketType.map(ticketDetails => (
                                                    <Select.Option value={ticketDetails.id}>{ticketDetails.name}</Select.Option>
                                                ))
                                            }
                                        </Select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Issued On</label>
                                    <DatePicker onChange={(event) => this.datePicker(event, 'issued-on')} name="IssuedOn" />
                                    {/* <input type="date" id="date" name="date" className="form-control" /> */}
                                </div>
                                <div className="form-group">
                                    <label>Expiry</label>
                                    <DatePicker onChange={(event) => this.datePicker(event, 'expiry')} name="Expiry" />
                                    {/* <input type="date" id="date" name="date" className="form-control" /> */}
                                </div>
                                <div className="form-group">
                                    <label>Ticket Id</label>
                                    <Form.Item
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please enter ticket Id!"
                                            }]}>
                                        <Input name="TicketId" onChange={(e) => this.changeHandler(e)} />
                                    </Form.Item>
                                    {/* <input type="text" className="form-control" id="ticketid" aria-describedby="nameHelp" /> */}
                                </div>
                                <div className="form-row">
                                    <div className="form-group col-lg-6">
                                        <label for="issuedby">Issued By</label>
                                        <Autosuggest
                                            suggestions={suggestions}
                                            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                            getSuggestionValue={this.getSuggestionValue}
                                            renderSuggestion={this.renderSuggestion}
                                            onSuggestionSelected={this.onSuggestionSelected}
                                            inputProps={inputProps} />
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
                                    <input className="form-check-input" type="checkbox" id="defaultCheck1" name="PublicTicket" onChange={(e) => this.getCheckBoxValue(e.target.checked)} />
                                    <label className="form-check-label" for="defaultCheck1">Public Ticket</label>

                                </div>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" className="login-submit mt-5">Add New Ticket</Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}
