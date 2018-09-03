import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import Weather from './Weather';

const API_KEY = '7eef14473d9b616c0de425b75eb04af5';

export default class App extends Component {
  state = {
    isLoaded: false,
    error: null,
    temperature: null,
    name: null,
  };

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        this._getWeather(position.coords.latitude, position.coords.longitude);
      },
      error => {
        this.setState({
          error: error
        });
      }
    );
  }

  _getWeather = async (lat, long) => {
    const json = await this._callApi(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&APPID=${API_KEY}`);
    if (json.cod === 200) {
      this.setState({
        temperature: json.main.temp,
        name: json.weather[0].main,
        isLoaded: true,
      }); 
    } else {
      this.setState({
        isLoaded: false,
        error: json.message
      });
    }
  }

  _callApi = (url) => {
    return fetch(url)
    .then(res => res.json())
    .catch(err => {
      console.log(err);
    })
  }

  render() {
    const { isLoaded, error, temperature, name } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        {isLoaded ? <Weather weatherName={name} temp={Math.floor(temperature - 273.15)} /> : (
          <View style={styles.loading}>
            <Text style={styles.loadingText}>Getting the weather data...</Text>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loading: {
    flex: 1,
    backgroundColor: '#FAF6AA',
    justifyContent: 'flex-end',
    paddingLeft: 25,
  },
  errorText: {
    color: 'red',
    backgroundColor: 'transparent',
    marginBottom: 40,
  },
  loadingText: {
    fontSize: 38,
    marginBottom: 40,
  }
});
