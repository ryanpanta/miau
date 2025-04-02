import React from "react";
import Input from "../Forms/Input";
import Button from "../Forms/Button";
import useForm from "../../Hooks/useForm";
import { userPost } from "../../api";
import { UserContext } from "../../UserContext";
import useFetch from "../../Hooks/useFetch";
import Error from "../Helper/Error";
import Head from '../Helper/Head'
function LoginCreate() {
    const username = useForm();
    const email = useForm("email");
    const password = useForm();

    const { userLogin } = React.useContext(UserContext);
    const {loading, error, request} = useFetch();

    async function handleSubmit(event) {
        event.preventDefault();
        try {
          await userPost({
            username: username.value,
            email: email.value,
            password: password.value,
          });
          await userLogin(username.value, password.value);
        } catch (error) {
         ("Erro ao criar usuário:", error.message);
        }
      }

    return (
        <section className="animeLeft">
            <Head title='Crie sua Conta' />
            <h1 className="title">Cadastre-se</h1>
            <form onSubmit={handleSubmit}>
                <Input
                    label="Usuário"
                    type="text"
                    name="username"
                    {...username}
                />
                <Input label="Email" type="email" name="email" {...email} />
                <Input
                    label="Senha"
                    type="password"
                    name="password"
                    {...password}
                />
                {loading ? <Button disabled>Cadastrando...</Button> : <Button>Cadastrar</Button>}
                <Error error={error}/>
            </form>
        </section>
    );
}

export default LoginCreate;
