import useSWR from "swr";

const fetchAPI = async (key) => {
  const response = await fetch(key);

  const responseBody = await response.json();

  return responseBody;
};

export default function StatusPage() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  const database = data?.dependencies?.database;

  return (
    <>
      <h1>Status</h1>
      <UpdatedAt isLoading={isLoading} updatedAt={data?.updated_at} />
      <MaxConnections isLoading={isLoading} max={database?.max_connections} />
      <OpenedConnections
        isLoading={isLoading}
        opened={database?.opened_connections}
      />
      <Version isLoading={isLoading} version={database?.version} />
    </>
  );
}

function UpdatedAt({ isLoading, updatedAt }) {
  const formattedDate = new Date(updatedAt).toLocaleString("pt-BR");

  return (
    <div>
      <p>Última atualização: {isLoading ? "Carregando..." : formattedDate} </p>
    </div>
  );
}

function MaxConnections({ isLoading, max }) {
  return (
    <div>
      <p>Número máximo de conexões: {isLoading ? "Carregando..." : max}</p>
    </div>
  );
}

function OpenedConnections({ isLoading, opened }) {
  return (
    <div>
      <p>
        Quantidade de conexões abertas: {isLoading ? "Carregando..." : opened}
      </p>
    </div>
  );
}

function Version({ isLoading, version }) {
  return (
    <div>
      <p>Versão: {isLoading ? "Carregando..." : version}</p>
    </div>
  );
}
