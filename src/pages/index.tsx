import { FormEvent, useState } from 'react';
import { api } from '../lib/axios';
import Image from 'next/image'
import appPreviewImg from '../assets/app-nlw-copa-preview.png'
import usersAvatarExampleImg from '../assets/users-avatar-example.png'
import iconCheck from '../assets/icon-check.svg'
import logoImp from '../assets/logo.svg'
interface HomeProps {
  pollCount: number;
  guessCount: number;
  userCount: number;
}


export default function Home(props: HomeProps) {

  const [pollTitle, setPollTitle] = useState('')

  async function createPoll(event: FormEvent) {
    event.preventDefault()

    try {
      const response = await api.post('/polls', {
        title: pollTitle,
      });

      const { code } = response.data

        // Vai copiar o conteudo da variavel code no clipboard do usuario
      await navigator.clipboard.writeText(code)

      alert('Bolão criado com sucesso! Código copiado na sua área de transferência!')
      setPollTitle('');

    } catch(err) {
      console.log(err)
      alert('Falha ao criar o bolão, tente novamente!')
    }
  }

  return (
    <div className='max-w-[1124px] h-screen mx-auto grid grid-cols-2 items-center gap-28'>
      <main>
        <Image src={logoImp} alt="NLW Copa" />
        
        <h1 className='mt-14 text-white text-5xl font-bold leading-tight'>
          Crie seu próprio bolão da Copa e compartilhe com seus amigos!
        </h1>
        
        <div className='mt-10 flex items-center gap-2'>
          <Image src={usersAvatarExampleImg} alt="" />
          <strong className='text-gray-100 text-xl'>
            <span className='text-ignite-500'>+{props.userCount}</span> pessoas já estão participando
          </strong>
        </div>

        <form onSubmit={createPoll} className='mt-10 flex gap-2'>
          <input 
            required 
            placeholder='Qual nome do seu Bolão?' 
            type="text" 
            onChange={event=>setPollTitle(event.target.value)}
            value={pollTitle}
            className='flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100'
          />
          <button 
            type="submit"
            className='bg-yellow-500 px-6 py-4 rounded bg-gray-900 font-bold text-sm uppercase hover:bg-yellow-300'
          >
            Criar meu bolão
          </button>
        </form>

        <p className='mt-4 text-sm text-gray-300 leading-relaxed'>
          Após criar seu bolão, você receberá um código único que poderá usar para convidar sua turma 🚀
        </p>

        <div className='mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100'>
          <div className='flex items-center gap-6'>
            <Image src={iconCheck} alt="" />
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{props.pollCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className='w-px h-14 bg-gray-600'></div>

          <div className='flex items-center gap-6'>
            <Image src={iconCheck} alt="" />
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{props.guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image 
        src={appPreviewImg} 
        alt="Dois celulares exibindo uma prévia do aplicativo de bolão"
        quality={100} 
      />
    </div>
  )
}

export const getStaticProps = async () => {

  const [pollCountResponse, guessCountResponse, userCountResponse] = await Promise.all([
    api.get('/polls/count'),
    api.get('/guesses/count'),
    api.get('/users/count'),
  ])

  return {
    props: {
      pollCount: pollCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    }, 
    revalidate: 30,
  }
}