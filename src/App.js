import React, { useEffect, useState } from 'react';
import './App.css'; // Importando o CSS

function App() {
  const [dados, setDados] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/cadastro.json'); // Caminho para o arquivo JSON
        const data = await response.json();
        setDados(data);
      } catch (error) {
        console.error('Erro ao buscar os dados:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>BotCell v1</h1>
      <table>
        <thead>
          <tr>
            <th>Host</th>
            <th>Nome</th>
            <th>Email</th>
            <th>CPF</th>
            <th>SENHA</th>
          </tr>
        </thead>
        <tbody>
          {dados.map((item, index) => (
            <tr key={index}>
              <td>
                <a href={item.target} target='_blank' rel='noopener noreferrer'>
                  {item.target}
                </a>
              </td>
              <td>{item.nome}</td>
              <td>{item.email}</td>
              <td>{item.cpf}</td>
              <td>{item.senha}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;