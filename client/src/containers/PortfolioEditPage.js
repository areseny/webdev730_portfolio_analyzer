import React, {Component} from 'react';
import {Button, Header, Icon, Modal} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import {PortfolioEdit} from '../components/PortfolioEdit';

export default class PortfolioEditPage extends Component {
  componentWillMount() {
    this.resetComponent();
  }

  resetComponent = () => {
    this.setState({
      modalOpen: false,
      editedPortfolio: {},
    });
  }

  handleCancel = () => {
    this.resetComponent();
  }

  handleChange = (e, {name, value}) => {
    this.setState({
      editedPortfolio: {
        ...this.state.editedPortfolio,
        [name]: value,
      },
    });
  }

  handleOpen = () => {
    const {portfolio} = this.props;
    if (portfolio) {
      this.setState({editedPortfolio: {id: portfolio.id, name: portfolio.name}});
    }
    this.setState({modalOpen: true});
  }

  handleSubmit = () => {
    this.props.onClickSubmit(this.state.editedPortfolio);
    this.resetComponent();
  }

  render() {
    const {iconColor, iconName, tooltip} = this.props;
    const {modalOpen, editedPortfolio} = this.state;
    return (
      <Modal
        closeOnDimmerClick={false}
        trigger={<Icon name={iconName} title={tooltip} id='portfolioPlus' link color={iconColor} onClick={this.handleOpen}/>}
        open={modalOpen}
        onClose={this.handleCancel}
        style={{paddingBottom:'10px'}}
      >
        <Modal.Header><Header content='Portfolio Editor' icon='edit' size='small'/></Modal.Header>
        <Modal.Content><PortfolioEdit portfolio={editedPortfolio} onChange={this.handleChange} onSubmit={this.handleSubmit}/></Modal.Content>
        <Modal.Actions>
          <Button floated='left'color='red' onClick={this.handleCancel}>Cancel</Button>
          <Button type='submit' floated='left' color='green' form='portfolioEditForm'>Submit</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

PortfolioEditPage.propTypes = {
  iconColor: PropTypes.string.isRequired,
  iconName: PropTypes.string.isRequired,
  onClickSubmit: PropTypes.func.isRequired,
  portfolio: PropTypes.object.isRequired,
  tooltip: PropTypes.string.isRequired,
}
