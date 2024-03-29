import Head from 'next/head';

const Header = ({ title = undefined, description = "This is my todo app!"}) => {
    return (
        <Head>
            <title>{title || "Todo App"}</title>
            <meta name="description" content={description} />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
    );
}

export default Header;