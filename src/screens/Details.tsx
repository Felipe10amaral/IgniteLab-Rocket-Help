import {useEffect, useState} from 'react';
import { VStack, Text, HStack, useTheme, ScrollView } from 'native-base';
import firestore from '@react-native-firebase/firestore';

import { Header } from '../components/Header';
import { useNavigation, useRoute } from '@react-navigation/native';
import { OrderProps } from '../components/Orders';
import { OrderFirestoreDTO } from '../DTO/OrderDTO';
import { dateFormat } from '../utils/firestoreDataDateFormat';
import { Loading } from '../components/Loading';
import { CircleWavyCheck, Hourglass, DesktopTower, Clipboard } from 'phosphor-react-native';
import { CardDetails } from '../components/CardDetails';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Alert } from 'react-native';

type RouteParams = {
  orderId: string;
}

type OderDetails = OrderProps & {
  description: string;
  solution: string;
  closed: string;
}

export function Details() {
  const [order, setOrder] = useState<OderDetails>( {} as OderDetails );
  const [isLoading, setIsLoading] = useState(true);
  const [solution, setSolution] = useState('');

  const {colors} = useTheme();
  const route = useRoute();
  const {orderId} = route.params as RouteParams;

  const navigation = useNavigation();

  function handleOrderClose() {
    if(!solution) {
      return Alert.alert('Solicitação', 'Informe solução para encerrar solicitação');
    }

    firestore()
    .collection<OrderFirestoreDTO>('order')
    .doc(orderId)
    .update({
      status: 'closed',
      solution,
      closed_at: firestore.FieldValue.serverTimestamp()
    })
    .then( () => {
      Alert.alert('Solicitação','Solicitação encerrada');
      navigation.goBack();
    })
    .catch((error) => {
      console.log(error)
      Alert.alert('Erro','Não foi possivel encerrar a solicitação ')
    })
  }

  useEffect( () => {
    firestore()
    .collection<OrderFirestoreDTO>('order')
    .doc(orderId)
    .get()
    .then( (doc) => {
      const { patrimony, description,status, created_at, closed_at, solution} = doc.data()

      const closed = closed_at ? dateFormat(closed_at) : null;

      setOrder({
        id: doc.id,
        patrimony,
        description,
        status,
        solution,
        when: dateFormat(created_at),
        closed
      });

      setIsLoading(false);

      console.log({
        id: doc.id,
        patrimony,
        description,
        status,
        solution,
        when: dateFormat(created_at),
        closed
      })
    })
  }, []);

  if(isLoading) {
    return <Loading />
  }
  return (
    <VStack flex={1} bg="gray.700" >
        <Header title='solicitação' />
        
        <HStack bg="gray.500" justifyContent="center" p={4} >
          {
            order.status === 'closed' 
             ? <CircleWavyCheck size={22} color={colors.green[300]} />
             : <Hourglass size={22} color={colors.secondary[700]} />
          }

          <Text
            fontSize="sm"
            color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]}
            ml={2}
            textTransform="uppercase"
          >
            {order.status === 'closed' ? 'finalizado' : 'em andamento'}
          </Text>
        </HStack>
        
        <ScrollView mx={5} showsVerticalScrollIndicator={false} >
          <CardDetails 
            title='equipamento'
            description={`Patrimonio ${order.patrimony}`}
            icon={DesktopTower}
          />

          <CardDetails 
            title='descrição do problema'
            description={order.description}
            icon={Clipboard}
            footer={`Registrado em ${order.when}`}
          />

          <CardDetails 
            title='Solução'
            icon={CircleWavyCheck}
            footer={order.closed && `Encerrado em ${order.closed}`}
            description={order.solution}
          >
            {
              order.status === 'open' &&
              <Input 
                placeholder='Descrição da solução'
                onChangeText={setSolution}
                h={24}
                multiline
                textAlignVertical='top'
             />
            }
          </CardDetails>
        </ScrollView>

        {
          order.status === 'open' && <Button title='Encerrar solicitação' m={5} onPress={handleOrderClose} />
        }
    </VStack>
  );
}