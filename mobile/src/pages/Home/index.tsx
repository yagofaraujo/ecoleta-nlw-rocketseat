import React, { useState, useEffect } from 'react'
import { Feather as Icon } from '@expo/vector-icons'
import { View, ImageBackground, Image, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, SafeAreaView, Alert } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native'
import { Roboto_900Black } from '@expo-google-fonts/roboto';
import axios from 'axios'


interface IBGEUFResponse {
  sigla: string
}

interface IBGECityResponse {
  nome: string
}

const Home = () => {
  const navigation = useNavigation()

  const [selectedUf, setSelectedUf] = useState('')
  const [selectedCity, setSelectedCity] = useState('')

  const [ufs, setUfs] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])


  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(response => {
        const ufInitials = response.data.map(uf => uf.sigla)

        setUfs(ufInitials)
      })
  }, [])

  useEffect(() => {
    if (selectedUf === '') {
      return
    }

    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(response => {
        const cityNames = response.data.map(city => city.nome)

        setCities(cityNames)
      })
  }, [selectedUf])

  function handleNavigateToPoints() {
    if (selectedUf === '') {
      Alert.alert('Selecione uma federação válida!')
    } else if (selectedCity === '') {
      Alert.alert('Selecione uma cidade válida!')
    } else {
      navigation.navigate('Points', {
        uf: selectedUf,
        city: selectedCity
      })
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ImageBackground
        source={require('../../assets/home-background.png')}
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <View>
            <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text
            style={styles.textLabel}
          >
            UF:
          </Text>

          <RNPickerSelect
            style={pickerSelectStyles}
            placeholder={
              {
                label: 'Selecione uma UF',
                value: '',
              }
            }
            onValueChange={uf => setSelectedUf(uf)}
            Icon={() => {
              return <Icon name="arrow-down" size={24} color="gray" />;
            }}
            items={
              ufs.map(uf => (
                { label: uf, value: uf })
              )
            }
          />

          <Text
            style={styles.textLabel}
          >
            Cidade:
          </Text>

          <RNPickerSelect
            style={pickerSelectStyles}
            placeholder={
              {
                label: 'Selecione uma cidade',
                value: '',
              }
            }
            onValueChange={city => setSelectedCity(city)}
            Icon={() => {
              return <Icon name="arrow-down" size={24} color="gray" />;
            }}
            items={
              cities.map(city => (
                { label: city, value: city })
              )
            }
          />

          <RectButton
            style={styles.button}
            onPress={handleNavigateToPoints}
          >
            <View style={styles.buttonIcon}>
              <Text>
                <Icon
                  name="arrow-right"
                  color="#FFF"
                  size={24}
                />
              </Text>
            </View>
            <Text style={styles.buttonText}>
              Entrar
          </Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  textLabel: {
    paddingLeft: 8,
    marginBottom: 8,
    fontSize: 16,
  },

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 24,
    fontSize: 16,
  },
  inputAndroid: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 24,
    fontSize: 16,
  },
  iconContainer: {
    position: 'absolute',
    top: 18,
    right: 10,
  },
});

export default Home