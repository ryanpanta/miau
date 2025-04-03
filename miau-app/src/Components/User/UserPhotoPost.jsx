import React from "react";
import styles from "./UserPhotoPost.module.css";
import Input from "../Forms/Input";
import Button from "../Forms/Button";
import useForm from "../../Hooks/useForm";
import useFetch from "../../Hooks/useFetch";
import { photoPost } from "../../api";
import Error from '../Helper/Error'
import { useNavigate } from "react-router-dom";
import Head from "../Helper/Head";

function UserPhotoPost() {
  const nome = useForm();
  const peso = useForm();
  const idade = useForm();
  const descricao = useForm();
  const [img, setImg] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    if(data) navigate('/conta')
  }, [data, navigate])

  async function handleSubmit(event) {
    try {
    setLoading(true);
    event.preventDefault();
    const formData = new FormData();
    formData.append("image", img.raw);
    formData.append("catName", nome.value);
    formData.append("weight", peso.value);
    formData.append("age", idade.value);
    formData.append("description", descricao.value);

    const response = await photoPost(formData);
    setData(response);
    } catch (error) {
      setError(error.message);
    }
    finally {
      setLoading(false);
    }

  }

  function handleImageChange({ target }) {
    setImg({
      preview: URL.createObjectURL(target.files[0]),
      raw: target.files[0],
    });
  }

 
  return (
    <section className={`${styles.photoPost} animeLeft`}>
      <Head title='Poste sua Foto' />
      <form onSubmit={handleSubmit}>
        <Input label="Nome" type="text" name="nome" {...nome} />
        <Input label="Peso" type="number" name="peso" {...peso} />
        <Input label="Idade" type="number" name="idade" {...idade} />
        <Input label="Descrição" type="text" name="descricao" {...descricao} />
        <input
          className={styles.file}
          type="file"
          name="img"
          id="img"
          onChange={handleImageChange}
        />
        {loading ? <Button disabled >Enviando...</Button> : <Button>Enviar</Button>}
        <Error error={error}/>
        
      </form>
      <div>
        {img.preview && (
          <div
            className={styles.preview}
            style={{ backgroundImage: `url(${img.preview})` }}
          >
            
          </div>
        )}
      </div>
    </section>
  );
}

export default UserPhotoPost;
