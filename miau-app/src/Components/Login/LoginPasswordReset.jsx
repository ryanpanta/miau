import React from "react";
import { useParams } from "react-router-dom";
import Input from "../Forms/Input";
import useForm from "../../Hooks/useForm";
import Button from "../Forms/Button";
import useFetch from "../../Hooks/useFetch";
import { passwordReset } from "../../api";
import Error from "../Helper/Error";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext";
import Head from "../Helper/Head";

function LoginPasswordReset() {
    const { userLogin } = React.useContext(UserContext);
    const navigate = useNavigate();
    const [login, setLogin] = React.useState("");
    const [key, setKey] = React.useState("");
    const password = useForm();
    const { error, loading, request } = useFetch();
    async function handleSubmit(event) {
        event.preventDefault();
        if (password.validate()) {
            const { url, options } = passwordReset({
                login,
                key,
                password: password.value,
            });
            const { response } = await request(url, options);
            if (response.ok) {
                userLogin(login, password.value);
            }
        }
    }
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const key = params.get("key");
        const login = params.get("login");
        if (key) setKey(key);
        if (login) setLogin(login);
    }, []);
    return (
        <section>
            <Head title="Resetar Senha" />
            <h1 className="title">Resete a Senha</h1>
            <form onSubmit={handleSubmit}>
                <Input
                    label="Nova Senha"
                    type="password"
                    name="password"
                    {...password}
                />
                {loading ? (
                    <Button disabled>Resetando...</Button>
                ) : (
                    <Button>Resetar</Button>
                )}
                <Error error={error} />
            </form>
        </section>
    );
}

export default LoginPasswordReset;
