import { VStack } from 'native-base';
import { useState } from 'react';
import { Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Input } from '../components/Input';

export function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [patrimony, setPatrimony] = useState('');
  const [description, setDescription] = useState('');
  
  const navigation = useNavigation();

  function handleNewOrderRegister() {
    if(!patrimony || !description) {
      return Alert.alert('Erro' ,'Preencha todos os campos');
    }

    setIsLoading(true);

    firestore()
    .collection('order')
    .add({
      patrimony,
      description,
      status: 'open',
      created_at: firestore.FieldValue.serverTimestamp()
    })
    .then( () => {
      Alert.alert('Solicitação', "Solicitação registrada com sucesso");
      navigation.goBack();
    })
    .catch( (error) => {
      console.log(error);
      setIsLoading(false);
      Alert.alert('Erro' ,'Não foi possível registrar o pedido');
    })
  }

  return (
    <VStack flex={1} p={6} bg="gray.600" >
        <Header title='Nova Solicitação'/>

        <Input 
            placeholder='Número do patrimônio'
            mt={4}
            onChangeText={setPatrimony}
        />

        <Input 
            placeholder='Descrição do problema'
            mt={5}
            flex={1}
            multiline
            textAlignVertical='top'
            onChangeText={setDescription}
        />

        <Button 
            title='Cadastrar'
            mt={5}
            isLoading={isLoading}
            onPress={handleNewOrderRegister}
        />
    </VStack>
  );
}