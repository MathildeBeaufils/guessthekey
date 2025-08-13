import Head from 'next/head'

export default function SEO({ title, description }) {
    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
            <html lang="fr"></html>
            <link rel="icon" href="/cleDeSol" />
        </Head>
    )
}

// import SEO from '../components/SEO'
// <SEO title="Connection | Guess The Key" description="Connectez vous pour obtenir plus de contenue." />