import React, { Component } from 'react';
import { View, StyleSheet, Image, ImageStore } from 'react-native';
import { connect } from 'react-redux';
import { Headline, Body, Button } from 'react-native-ios-kit';
import { Actions } from 'react-native-router-flux';
import { ImagePicker, Permissions } from 'expo';

import { logout, uploadProfilePicture } from '../../actions';
import { Spinner, ProfilePicture } from '../../ui';

class Settings extends Component {

  componentWillReceiveProps(nextProps) {
    if (!nextProps.authToken) Actions.replace('login');
  }

  _pickPhoto = () => {
    Permissions.askAsync(Permissions.CAMERA_ROLL).then(async (result) => {
      if (result.status === 'granted') {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaType: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          base64: true
        });
        if (!result.cancelled) this.props.uploadProfilePicture(this.props.authToken, this.props.client, this.props.uid, result.base64);
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  render() {
    if (this.props.isLoading) return <Spinner/>;
    return (
      <View style={{flex: 1}}>
        {this.props.user ?
         <View style={{padding: 15, alignItems: 'center'}}>
           <ProfilePicture uri={this.props.user.image.url}/>
           <Button
             onPress={this._pickPhoto}
             style={{marginTop: 5}}
           >Edit</Button>
           <View style={{height: 15}}/>
           <Headline>{this.props.user.nickname}</Headline>
           <Body>{this.props.user.email}</Body>
         </View>
           : null }
        <View style={{paddingHorizontal: 10}}>
          <Button
            onPress={() => this.props.logout()}
            centered
            inverted
            rounded
          >Logout</Button>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    isLoading: state.isLoading,
    authToken: state.authToken,
    client: state.client,
    uid: state.uid,
    user: state.user
  };
};

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
  uploadProfilePicture: (authToken, client, uid, photo) => dispatch(uploadProfilePicture(authToken, client, uid, photo))
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
