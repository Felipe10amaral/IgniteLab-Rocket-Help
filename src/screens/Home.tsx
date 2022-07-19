import { Heading, HStack, IconButton, Text, useTheme, VStack, FlatList } from 'native-base';
import { ItemClick } from 'native-base/lib/typescript/components/composites/Typeahead/useTypeahead/types';
import {SignOut} from 'phosphor-react-native';
import { useState } from 'react';

import Logo from '../assets/logo_secondary.svg';
import { Filter } from '../components/filter';

export function Home() {
  const { colors }= useTheme(); 
  
  const [statusSelected, setStatusSelected] = useState<'open' | 'closed' >('open');
  const [orders, setOrders] = useState([{
    id: '123',
    patrimony: '12345',
    when: '18/07/2022 às 10:00',
    status: 'open'
  }]);
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
                icon={<SignOut size={26} color={colors.gray[300]} />}
            />
        </HStack>

        <VStack flex={1} px={6}>
            <HStack w="full" mt={8} mb={4} justifyContent="space-between" alignItems="center" >
                <Heading color="gray.100">
                    Meus Chamados
                </Heading>
                <Text color="gray.200" > 3 </Text>
            </HStack>    
            <HStack space={3} mb={8}>
                <Filter title='Em Andamento' type='open' isActive={statusSelected === 'open'} onPress={() => setStatusSelected('open')}/>
                <Filter title='Finalizado' type='closed' isActive={statusSelected === 'closed'} onPress={() => setStatusSelected('closed')} />
            </HStack>

            <FlatList 
                data={orders}
                keyExtractor={item => item.id}
                renderItem={ ({item}) => <Text color="white"> {item.status} </Text> }
            />
        </VStack>      
    </VStack>
  );
}