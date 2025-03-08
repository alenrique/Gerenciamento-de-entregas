INSERT INTO Cliente (nome, cpf, email, telefone) VALUES
('João Silva', '213.243.223-22', 'joao.silva@example.com', '(11) 99999-9999'),
('Maria Oliveira', '234.562.345-32', 'maria.oliveira@example.com', '(11) 88888-8888');

INSERT INTO Entrega (cliente_id, peso, endereco, logradouro, numero, bairro, complemento, cidade, estado, pais, latitude, longitude) VALUES
(1, 5.5, 'Rua das Flores, 123, Jardim das Acácias, São Paulo, SP, Brasil', 'Rua das Flores', '123', 'Jardim das Acácias', 'Apto 101', 'São Paulo', 'SP', 'Brasil', -23.550520, -46.633308),
(2, 10.0, 'Avenida Paulista, 1000, Bela Vista, São Paulo, SP, Brasil', 'Avenida Paulista', '1000', 'Bela Vista', 'Casa', 'São Paulo', 'SP', 'Brasil', -23.561399, -46.655539);
