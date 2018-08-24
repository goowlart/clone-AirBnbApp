import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { StatusBar, AsyncStorage } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';

import api from '../../services/api';

import {
  Container,
  Logo,
  Input,
  ErrorMessage,
  Button,
  ButtonText,
  SignUpLink,
  SignUpLinkText,
} from './styles';

export default class SignIn extends Component {
    static navigationOptions = {
        header: null,
    };

    state = { email: '', password: '', error: '' };

    handleEmailChange = (email) => {
        this.setState({ email });
    };
      
    handlePasswordChange = (password) => {
        this.setState({ password });
    };
      
    handleCreateAccountPress = () => {
        this.props.navigation.navigate('SignUp');
    };

    handleSignInPress = async () => {
        if (this.state.email.length === 0 || this.state.password.length === 0) {
          this.setState({ error: 'Preencha usuário e senha para continuar!' }, () => false);
        } else {
          try {
            const response = await api.post('/sessions', { //Assign to a constant the return of sending a POST request to the route / sessions of the API with the email and password in the request body;
              email: this.state.email,
              password: this.state.password,
            });
              
            await AsyncStorage.setItem('@AirBnbApp:token', response.data.token); //If the authentication request was successful we will save it in Async Storage, which is an API for offline storage of React Native, the JWT token returned, since we will use it in all requests from now on;
    
            const resetAction = StackActions.reset({ //Create a constant containing the instructions to reset the Navigation Stack, so that when the application is redirected to the main screen it does not have a return button to the Login;
              index: 0,
              actions: [
                NavigationActions.navigate({ routeName: 'Main' }),
              ],
            });
            this.props.navigation.dispatch(resetAction); //Dispatch in this constant containing the reset instructions.
          } catch (_err) {
            this.setState({ error: 'Houve um problema com o login, verifique suas credenciais!' });
          }
        }
    };



  render() {
    return (
      <Container>
        <StatusBar hidden />
        <Logo source={require('../../images/airbnb_logo.png')} resizeMode="contain" />
        <Input
          placeholder="Endereço de e-mail"
          value={this.state.email}
          onChangeText={this.handleEmailChange}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Input
          placeholder="Senha"
          value={this.state.password}
          onChangeText={this.handlePasswordChange}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
        />
        {this.state.error.length !== 0 && <ErrorMessage>{this.state.error}</ErrorMessage>}
        <Button onPress={this.handleSignInPress}>
          <ButtonText>Entrar</ButtonText>
        </Button>
        <SignUpLink onPress={this.handleCreateAccountPress}>
          <SignUpLinkText>Criar conta grátis</SignUpLinkText>
        </SignUpLink>
      </Container>
    );
  }
}