async function connect() {  
  const { Pool } = require("pg");
    if(global.connection)
        return global.connection.connect();

    const pool = new Pool({
      user: process.env.USER_NAME,
      host: process.env.HOST_NAME,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      dialect: process.env.DB_DIALECT,
      port: process.env.PORT_NUMBER
    });
    
    const client = await pool.connect();
    console.log("O Pool de conexão foi criado com sucesso!")
    client.release();

    global.connection = pool;
    
    return pool.connect();
}

connect();

// Rota GET de todos os clientes
async function selectCustomers() {
  const client = await connect();
  const res = await client.query("SELECT * FROM client");
  return res.rows;
}

// Rota GET de um cliente específico
async function selectCustomer(id) {
  const client = await connect();
  const res = await client.query("SELECT * FROM client WHERE cpf=$1", [id]);
  return res.rows;
}

// Rota DELETE
async function deleteCustomer(id) {
  const client = await connect();
  const sql = "DELETE FROM client WHERE cpf=$1";
  const values = [id];
  
  await client.query(sql, values)
}

// Rota POST 
// Função assíncrona, ou seja, não vai rodar direto, só depois de algo acontecer
async function InsertCustomer(customer){
  // Vai esperar até que a informação chegue, se não chegar não roda
  const client = await connect();

  // Só vai rodar quando essa ação for requisitada. O $ se refere a cada coluna do banco, emtão $1 = cpf, $2 = email...
  const sql = "INSERT INTO client (cpf, nome, email, idade, profissao) VALUES ($1, $2, $3, $4, $5)"

  const values = [customer.cpf, customer.nome, customer.email, customer.idade, customer.profissao];

  await client.query(sql, values);

} 

module.exports = {
  InsertCustomer,
  selectCustomers,
  deleteCustomer,
  selectCustomer
} 