import Head from 'next/head'
import Image from 'next/image'
import Input from '../components/Input'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Termo</title>
        <meta name="description" content="Termo clone" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className={styles.title}>
        TERMO
      </h1>
      <Input />
    </div>
  )
}
