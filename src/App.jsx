import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

function App() {
  const { register, handleSubmit, reset, setFocus, watch } = useForm();

  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [viagens, setViagens] = useState([]);
  const [modalDestino, setModalDestino] = useState("");
  const [modalData, setModalData] = useState("");
  const [modalDuracao, setModalDuracao] = useState("");
  const [modalPreco, setModalPreco] = useState("");
  const [modalAtracoes, setModalAtracoes] = useState("");
  const [modalFoto, setModalFoto] = useState("");

  const [filterDestino, setFilterDestino] = useState("");
  const [filterMinPrice, setFilterMinPrice] = useState("");
  const [filterMaxPrice, setFilterMaxPrice] = useState("");

  useEffect(() => {
    const storedViagens = JSON.parse(localStorage.getItem("viagens"));
    if (storedViagens) {
      setViagens(storedViagens);
    }
  }, []);

  function saveViagensToLocalStorage(viagens) {
    localStorage.setItem("viagens", JSON.stringify(viagens));
  }

  function onOpenModal() {
    setOpen(true);
  }

  function onCloseModal() {
    setOpen(false);
  }

  function onOpenModal2() {
    setOpen2(true);
  }

  function onCloseModal2() {
    setOpen2(false);
  }

  function gravaDados(data) {
    const viagensCopy = [...viagens];
    viagensCopy.push({
      destino: data.destino,
      data: data.data,
      duracao: data.duracao,
      preco: data.preco,
      atracoes: data.atracoes,
      foto: data.foto,
    });
    setViagens(viagensCopy);
    saveViagensToLocalStorage(viagensCopy);
    setFocus("destino");
    reset({
      destino: "",
      data: "",
      duracao: "",
      preco: "",
      atracoes: "",
      foto: "",
    });
    onCloseModal();
  }

  function mostraViagem(indice) {
    const viagem = viagens[indice];
    setModalDestino(viagem.destino);
    setModalData(viagem.data);
    setModalDuracao(viagem.duracao);
    setModalPreco(viagem.preco);
    setModalAtracoes(viagem.atracoes);
    setModalFoto(viagem.foto);
    setOpen2(true);
  }

  function excluiViagem(indice) {
    if (window.confirm("Deseja Excluir essa viagem?")) {
      const viagensCopy = [...viagens];
      viagensCopy.splice(indice, 1);
      setViagens(viagensCopy);
      saveViagensToLocalStorage(viagensCopy);
    }
  }

  function alterarPrecoViagem(indice) {
    const novoPreco = prompt("Digite o novo preço para esta viagem:");
    if (novoPreco !== null) {
      const viagensCopy = [...viagens];
      viagensCopy[indice].preco = parseFloat(novoPreco);
      setViagens(viagensCopy);
      saveViagensToLocalStorage(viagensCopy);
    }
  }

  const handleFilterClick = () => {
    const destino = prompt("Filtrar por destino:");
    setFilterDestino(destino);
    const minPrice = prompt("Filtrar por preço mínimo:");
    setFilterMinPrice(minPrice);
    const maxPrice = prompt("Filtrar por preço máximo:");
    setFilterMaxPrice(maxPrice);
  };

  const clearFilter = () => {
    setFilterDestino("");
    setFilterMinPrice("");
    setFilterMaxPrice("");
  };

  const filteredViagens = viagens.filter((viagem) => {
    const preco = parseFloat(viagem.preco);

    const destinoMatch =
      !filterDestino ||
      viagem.destino.toLowerCase() === filterDestino.toLowerCase();
    const minPriceMatch =
      !filterMinPrice || preco >= parseFloat(filterMinPrice);
    const maxPriceMatch =
      !filterMaxPrice || preco <= parseFloat(filterMaxPrice);

    return destinoMatch && minPriceMatch && maxPriceMatch;
  });

  return (
    <div className="container-fluid">
      <div className="container mt-2">
        <h2 className="d-flex justify-content-between">
          <span>Listagem de Roteiros de Viagens</span>
          <button className="btn btn-primary" onClick={onOpenModal}>
            Incluir Roteiro
          </button>
        </h2>

        <div>
          <button className="btn btn-primary" onClick={handleFilterClick}>
            Filtrar
          </button>
          <button className="btn btn-secondary" onClick={clearFilter}>
            Ver Todos
          </button>
        </div>

        <table className="table table-hover mt-3">
          <thead>
            <tr>
              <th>Destino</th>
              <th>Data</th>
              <th>Duração</th>
              <th>Preço</th>
              <th>Foto</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredViagens.map((viagem, indice) => (
              <tr key={indice}>
                <td>{viagem.destino}</td>
                <td>{viagem.data}</td>
                <td>{viagem.duracao}</td>
                <td>{viagem.preco}</td>
                <td>
                  <img
                    src={viagem.foto}
                    alt={`Foto do Destino: ${viagem.destino}`}
                    width={150}
                    height={100}
                  />
                </td>
                <td>
                  <i
                    className="bi bi-search fs-4 text-info me-2"
                    title="Consultar"
                    style={{ cursor: "pointer" }}
                    onClick={() => mostraViagem(indice)}
                  ></i>
                  <i
                    className="bi bi-x-circle fs-4 text-danger"
                    title="Excluir"
                    style={{ cursor: "pointer" }}
                    onClick={() => excluiViagem(indice)}
                  ></i>
                  <i
                    className="bi bi-pencil fs-4 text-primary ms-2"
                    title="Alterar Preço"
                    style={{ cursor: "pointer" }}
                    onClick={() => alterarPrecoViagem(indice)}
                  ></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={open} onClose={onCloseModal} center>
        <div className="card">
          <div className="card-header">Inclusão de Roteiro de Viagem</div>
          <form className="card-body" onSubmit={handleSubmit(gravaDados)}>
            <h5 className="card-title">
              Informe os Detalhes do Roteiro de Viagem
            </h5>
            <div className="mb-3">
              <label htmlFor="destino" className="form-label">
                Destino:
              </label>
              <input
                type="text"
                className="form-control"
                id="destino"
                required
                {...register("destino")}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="data" className="form-label">
                Data:
              </label>
              <input
                type="date"
                className="form-control"
                id="data"
                required
                {...register("data")}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="duracao" className="form-label">
                Duração (dias):
              </label>
              <input
                type="number"
                className="form-control"
                id="duracao"
                required
                {...register("duracao")}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="preco" className="form-label">
                Preço:
              </label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                id="preco"
                required
                {...register("preco")}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="atracoes" className="form-label">
                Atrações:
              </label>
              <input
                type="text"
                className="form-control"
                id="atracoes"
                required
                {...register("atracoes")}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="foto" className="form-label">
                URL da Foto do Destino:
              </label>
              <input
                type="url"
                className="form-control"
                id="foto"
                required
                {...register("foto")}
              />
            </div>
            <input
              type="submit"
              value="Enviar"
              className="btn btn-primary px-5"
            />
          </form>
          {watch("foto") && (
            <img
              src={watch("foto")}
              alt="Foto do Destino"
              width={240}
              height={200}
              className="rounded mx-auto d-block"
            />
          )}
        </div>
      </Modal>

      <Modal open={open2} onClose={onCloseModal2} center>
        <div className="card">
          <img
            src={modalFoto}
            className="card-img-top"
            alt="Destino"
            width={500}
            height={400}
          />
          <div className="card-body">
            <h5 className="card-title">{modalDestino}</h5>
            <p className="card-text">
              <strong>Data:</strong> {modalData}
              <br />
              <strong>Duração:</strong> {modalDuracao} dias
              <br />
              <strong>Preço:</strong> R$ {modalPreco}
              <br />
              <strong>Atrações:</strong> {modalAtracoes}
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default App;
