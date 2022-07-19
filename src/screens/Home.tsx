import { Heading, HStack, IconButton, Text, useTheme, VStack, FlatList, Center } from 'native-base';
import { ItemClick } from 'native-base/lib/typescript/components/composites/Typeahead/useTypeahead/types';
import {SignOut} from 'phosphor-react-native';
import { useState } from 'react';
import { ChatTeardropText} from 'phosphor-react-native';
import Logo from '../assets/logo_secondary.svg';
import { Button } from '../components/Button';
import { Filter } from '../components/filter';
import { Orders, OrderProps } from '../components/Orders';

export function Home() {
  const { colors }= useTheme(); 
  
  const [statusSelected, setStatusSelected] = useState<'open' | 'closed' >('open');
  const [orders, setOrders] = useState<OrderProps[]>([]);
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
                renderItem={ ({item}) => <Orders data={item}  /> }
                ListEmptyComponent={ () => (
                    <Center>
                        <ChatTeardropText color={colors.gray[300]} size={40} />
                        <Text color="gray.300" fontSize="xl" mt={6} textAlign="center" >
                            Você ainda não possui {'\n'} solicitações {statusSelected === 'open' ? 'em andamento' : 'finalizadas'}
                        </Text>
                    </Center>
                )}
            />
            <Button title='Nova Solicitação' />
        </VStack>      
    </VStack>
  );
}