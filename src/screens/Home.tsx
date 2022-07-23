import { Heading, HStack, IconButton, Text, useTheme, VStack, FlatList, Center } from 'native-base';
import auth from '@react-native-firebase/auth';
import {Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {SignOut} from 'phosphor-react-native';
import { useState, useEffect } from 'react';
import { ChatTeardropText} from 'phosphor-react-native';
import firestore from '@react-native-firebase/firestore';

import Logo from '../assets/logo_secondary.svg';
import { Button } from '../components/Button';
import { Filter } from '../components/filter';
import { Orders, OrderProps } from '../components/Orders';
import { dateFormat } from '../utils/firestoreDataDateFormat';
import { Loading } from '../components/Loading';

export function Home() {
  const { colors }= useTheme(); 
  const navigation = useNavigation();
  
  const [loading, setLoading] = useState(true);
  const [statusSelected, setStatusSelected] = useState<'open' | 'closed' >('open');
  const [orders, setOrders] = useState<OrderProps[]>([]);

  function handleNewOrders() {
    navigation.navigate('new');
  }

  function handleOpenDetails(orderId: string) {
    navigation.navigate('details', { orderId})
    console.log("passou")
  }

  function handleLogOut() {
    auth()
    .signOut()
    .catch( (error) => {
      console.log(error);
      return Alert.alert("Não foi possivel sair");
    });
  }

  useEffect( () => {
    setLoading(true);

    const subscriber = firestore()
      .collection('order')
      .where('status', '==', statusSelected)
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => {
          const { patrimony, description, status, created_at} = doc.data();
           
          return {
            id: doc.id,
            patrimony,
            description,
            status,
            when: dateFormat(created_at)
           }
        });
        setOrders(data);
        setLoading(false);
    });

    return subscriber;
  }, [statusSelected]);

  return (
    <VStack flex={1} pb={6} bg="gray.700" >
        <HStack
            w="full"
            justifyContent="space-between"
            alignItems="center"
            bg="gray.600"
            pt={12}
            pb={5}
            px={6}
        >
            <Logo />

            <IconButton
                icon={<SignOut size={26} color={colors.gray[300]}  />}
                onPress={handleLogOut}
            />
        </HStack>

        <VStack flex={1} px={6}>
            <HStack w="full" mt={8} mb={4} justifyContent="space-between" alignItems="center" >
                <Heading color="gray.100">
                    Meus Chamados
                </Heading>
                <Text color="gray.200" > {orders.length} </Text>
            </HStack>    
            <HStack space={3} mb={8}>
                <Filter title='Em Andamento' type='open' isActive={statusSelected === 'open'} onPress={() => setStatusSelected('open')}/>
                <Filter title='Finalizado' type='closed' isActive={statusSelected === 'closed'} onPress={() => setStatusSelected('closed')} />
            </HStack>

            {
              loading ? <Loading /> :
              <FlatList 
                data={orders}
                keyExtractor={item => item.id}
                renderItem={ ({item}) => <Orders data={item} onPress={() => handleOpenDetails(item.id)} /> }
                ListEmptyComponent={ () => (
                    <Center>
                        <ChatTeardropText color={colors.gray[300]} size={40} />
                        <Text color="gray.300" fontSize="xl" mt={6} textAlign="center" >
                            Você ainda não possui {'\n'} solicitações {statusSelected === 'open' ? 'em andamento' : 'finalizadas'}
                        </Text>
                    </Center>
                )}
            />
            }
            <Button title='Nova Solicitação' onPress={handleNewOrders} />
        </VStack>      
    </VStack>
  );
}