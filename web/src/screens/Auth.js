import React, {Component} from 'react';
import { 
    View, 
    StyleSheet, 
    Text, 
    AsyncStorage,
    ImageBackground,
    TouchableOpacity,
    Alert
} from 'react-native';
import commonStyles from '../commonStyles';
import backgroundImage from '../../assets/imgs/login.jpg';
import AuthInput from '../components/AuthInput';
import axios from 'axios';
import {server, showError} from '../common';

export default class Auth extends Component {
    state = {
        stageNew: false,
        name: '',
        email: 'paulofelipemartins@gmail.com',
        password: '123456',
        confirmPassword: '',
    }

    signIn = async () => {
        try {
            const res = await axios.post(`${server}/signin`, {                                        
                email: this.state.email,
                password: this.state.password,
            })  

            axios.defaults.headers.common['Authorization'] = 
            `bearer ${res.data.token}`;

            AsyncStorage.setItem('userData', JSON.stringify(res.data));

            this.props.navigation.navigate('Home', res.data);
            
        } catch (error) {
            showError(error);
        }
    }
    signUp = async () => {
        try {
            await axios.post(`${server}/signup`, {
                name: this.state.name,
                email: this.state.email,
                password: this.state.password,
            })

            Alert.alert('Sucesso!', 'Usuário cadastrado :)');
            this.setState({ stageNew: false })
        } catch (error) {                
            showError(error);
        }
    }


    signinOrSignup = () => {        
        if (this.state.stageNew){
            this.signUp();
        }else{
            this.signIn();
        }
    }

    render(){

        const validations = [];
        validations.push(this.state.email && this.state.email.includes('@'));
        validations.push(this.state.password && this.state.password.length >= 4);

        if(this.state.stageNew){
            validations.push(this.state.name && this.state.name.trim());
            validations.push(this.state.confirmPassword);
            validations.push(this.state.password === this.state.confirmPassword);
        }

        const validForm = validations.reduce((all, v) => all & v);

        return (
            <ImageBackground 
                source={backgroundImage} 
                style={styles.background}
            >  
                <Text style={styles.title}>Tasks</Text>
                <View style={styles.formContainer}>
                    <Text style={styles.subtitle}>
                        {this.state.stageNew ?
                            'Crie a sua conta': 'Informe seus dados'}
                    </Text>
                    {this.state.stageNew &&
                        <AuthInput icon='user' placeholder="Nome" style={styles.input}
                            value={this.state.name}
                            onChangeText={name => this.setState({name})}/>}
                    <AuthInput icon='at' placeholder="Email" style={styles.input}
                            value={this.state.email}
                            onChangeText={email => this.setState({email})}/>
                    <AuthInput icon='lock' secureTextEntry={true} 
                            placeholder="Password" style={styles.input}
                            value={this.state.password}
                            onChangeText={password => this.setState({password})}/>
                    {this.state.stageNew &&
                        <AuthInput icon='lock' secureTextEntry={true} 
                            placeholder="Confirmação" style={styles.input}
                            value={this.state.confirmPassword}
                            onChangeText={confirmPassword => this.setState({confirmPassword})}/>}
                    <TouchableOpacity 
                        disabled={!validForm}
                        onPress={this.signinOrSignup}
                    >
                        <Text style={[styles.button,styles.buttonText, !validForm ? { backgroundColor: '#AAA'} : {} ]}>
                            {this.state.stageNew ? 'Registrar' : 'Entrar'}
                        </Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity 
                    style={{padding:10}} 
                    onPress={() => this.setState({ stageNew: !this.state.stageNew })}
                >
                    <Text style={styles.buttonText}>
                        {this.state.stageNew ? 'Já possui conta' : 'Ainda não possui conta?'}
                    </Text>
                </TouchableOpacity>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 70,
        marginBottom: 10,
    },
    subtitle: {        
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20,
        textAlign: 'center',
    },
    formContainer: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 20,
        width: '90%',
    },
    input: {
        marginTop: 10,
        backgroundColor: '#FFF',
    },
    button: {
        backgroundColor: '#080',
        marginTop: 10,
        padding: 10,
        alignItems: 'center',
    },
    buttonText: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20,
        textAlign: 'center',
    }
})