-- Inserções para a tabela Cliente
INSERT INTO Cliente (nome, cpf, email, telefone) VALUES
('João Silva', '213.243.223-22', 'joao.silva@example.com', '(11) 99999-9999'),
('Maria Oliveira', '234.562.345-32', 'maria.oliveira@example.com', '(11) 88888-8888'),
('Pedro Santos', '345.673.456-43', 'pedro.santos@example.com', '(11) 77777-7777'),
('Ana Costa', '456.784.567-54', 'ana.costa@example.com', '(11) 66666-6666'),
('Carlos Oliveira', '567.895.678-65', 'carlos.oliveira@example.com', '(11) 55555-5555'),
('Fernanda Lima', '678.906.789-76', 'fernanda.lima@example.com', '(11) 44444-4444'),
('Ricardo Almeida', '789.017.890-87', 'ricardo.almeida@example.com', '(11) 33333-3333'),
('Mariana Souza', '890.128.901-98', 'mariana.souza@example.com', '(11) 22222-2222'),
('Lucas Pereira', '901.239.012-09', 'lucas.pereira@example.com', '(11) 11111-1111'),
('Juliana Rocha', '012.340.123-11', 'juliana.rocha@example.com', '(11) 00000-0000'),
('Gabriel Martins', '123.451.234-21', 'gabriel.martins@example.com', '(11) 99999-8888'),
('Patrícia Gonçalves', '234.562.345-31', 'patricia.goncalves@example.com', '(11) 88888-7777'),
('Bruno Ferreira', '345.673.456-44', 'bruno.ferreira@example.com', '(11) 77777-6666'),
('Camila Dias', '456.784.567-55', 'camila.dias@example.com', '(11) 66666-5555'),
('Eduardo Ribeiro', '567.895.678-66', 'eduardo.ribeiro@example.com', '(11) 55555-4444'),
('Amanda Carvalho', '678.906.789-77', 'amanda.carvalho@example.com', '(11) 44444-3333'),
('Marcos Pinto', '789.017.890-88', 'marcos.pinto@example.com', '(11) 33333-2222'),
('Isabela Gomes', '890.128.901-99', 'isabela.gomes@example.com', '(11) 22222-1111'),
('Roberto Nunes', '901.239.012-10', 'roberto.nunes@example.com', '(11) 11111-0000'),
('Tatiane Castro', '012.340.123-09', 'tatiane.castro@example.com', '(11) 00000-9999'),
('Felipe Mendes', '123.451.234-22', 'felipe.mendes@example.com', '(11) 99999-7777'),
('Larissa Araújo', '234.562.345-33', 'larissa.araujo@example.com', '(11) 88888-6666'),
('Diego Barbosa', '345.673.456-42', 'diego.barbosa@example.com', '(11) 77777-5555'),
('Vanessa Cardoso', '456.784.567-53', 'vanessa.cardoso@example.com', '(11) 66666-4444'),
('Gustavo Rocha', '567.895.678-67', 'gustavo.rocha@example.com', '(11) 55555-3333'),
('Renata Moreira', '678.906.789-75', 'renata.moreira@example.com', '(11) 44444-2222'),
('Thiago Alves', '789.017.890-89', 'thiago.alves@example.com', '(11) 33333-1111'),
('Cristina Fernandes', '890.128.901-97', 'cristina.fernandes@example.com', '(11) 22222-0000'),
('Alexandre Lima', '901.239.012-08', 'alexandre.lima@example.com', '(11) 11111-9999'),
('Daniela Costa', '012.340.123-10', 'daniela.costa@example.com', '(11) 00000-8888');

-- Inserções para a tabela Entrega
INSERT INTO Entrega (cliente_id, peso, endereco, logradouro, numero, bairro, complemento, cidade, estado, pais, latitude, longitude) VALUES
-- Entregas para João Silva (cliente_id = 1)
(1, 5.5, 'Rua das Flores, 123, Jardim das Acácias, São Paulo, SP, Brasil', 'Rua das Flores', '123', 'Jardim das Acácias', 'Apto 101', 'São Paulo', 'SP', 'Brasil', -23.550520, -46.633308),
(1, 7.0, 'Avenida Paulista, 1000, Bela Vista, São Paulo, SP, Brasil', 'Avenida Paulista', '1000', 'Bela Vista', 'Casa', 'São Paulo', 'SP', 'Brasil', -23.561399, -46.655539),

-- Entregas para Maria Oliveira (cliente_id = 2)
(2, 10.0, 'Rua da Praia, 200, Ponta Verde, Maceió, AL, Brasil', 'Rua da Praia', '200', 'Ponta Verde', 'Casa', 'Maceió', 'AL', 'Brasil', -9.665999, -35.735369),
(2, 8.5, 'Rua do Sol, 300, Centro, Aracaju, SE, Brasil', 'Rua do Sol', '300', 'Centro', 'Apto 202', 'Aracaju', 'SE', 'Brasil', -10.947246, -37.073082),

-- Entregas para Pedro Santos (cliente_id = 3)
(3, 6.0, 'Rua das Palmeiras, 400, Boa Viagem, Recife, PE, Brasil', 'Rua das Palmeiras', '400', 'Boa Viagem', 'Apto 303', 'Recife', 'PE', 'Brasil', -8.119818, -34.903917),

-- Entregas para Ana Costa (cliente_id = 4)
(4, 4.5, 'Rua das Flores, 500, Centro, Fortaleza, CE, Brasil', 'Rua das Flores', '500', 'Centro', 'Loja 10', 'Fortaleza', 'CE', 'Brasil', -3.731862, -38.526670),

-- Entregas para Carlos Oliveira (cliente_id = 5)
(5, 9.0, 'Avenida Beira Mar, 600, Meireles, Fortaleza, CE, Brasil', 'Avenida Beira Mar', '600', 'Meireles', 'Apto 404', 'Fortaleza', 'CE', 'Brasil', -3.725737, -38.496776),
(5, 3.5, 'Rua das Acácias, 700, Aldeota, Fortaleza, CE, Brasil', 'Rua das Acácias', '700', 'Aldeota', 'Casa', 'Fortaleza', 'CE', 'Brasil', -3.742952, -38.506064),

-- Entregas para Fernanda Lima (cliente_id = 6)
(6, 7.5, 'Rua das Mangueiras, 800, Manaíra, João Pessoa, PB, Brasil', 'Rua das Mangueiras', '800', 'Manaíra', 'Apto 505', 'João Pessoa', 'PB', 'Brasil', -7.115320, -34.882789),

-- Entregas para Ricardo Almeida (cliente_id = 7)
(7, 6.5, 'Rua das Flores, 900, Centro, Natal, RN, Brasil', 'Rua das Flores', '900', 'Centro', 'Sala 606', 'Natal', 'RN', 'Brasil', -5.779257, -35.200916),

-- Entregas para Mariana Souza (cliente_id = 8)
(8, 5.0, 'Rua das Palmeiras, 1000, Tirol, Natal, RN, Brasil', 'Rua das Palmeiras', '1000', 'Tirol', 'Apto 707', 'Natal', 'RN', 'Brasil', -5.794478, -35.201428),

-- Entregas para Lucas Pereira (cliente_id = 9)
(9, 8.0, 'Rua das Acácias, 1100, Ponta Negra, Natal, RN, Brasil', 'Rua das Acácias', '1100', 'Ponta Negra', 'Casa', 'Natal', 'RN', 'Brasil', -5.862839, -35.180678),

-- Entregas para Juliana Rocha (cliente_id = 10)
(10, 4.0, 'Rua das Flores, 1200, Centro, Salvador, BA, Brasil', 'Rua das Flores', '1200', 'Centro', 'Apto 808', 'Salvador', 'BA', 'Brasil', -12.972218, -38.501415),

-- Entregas para Gabriel Martins (cliente_id = 11)
(11, 6.0, 'Rua das Palmeiras, 1300, Barra, Salvador, BA, Brasil', 'Rua das Palmeiras', '1300', 'Barra', 'Apto 909', 'Salvador', 'BA', 'Brasil', -13.010093, -38.532494),

-- Entregas para Patrícia Gonçalves (cliente_id = 12)
(12, 7.0, 'Rua das Acácias, 1400, Pituba, Salvador, BA, Brasil', 'Rua das Acácias', '1400', 'Pituba', 'Casa', 'Salvador', 'BA', 'Brasil', -12.991855, -38.455589),

-- Entregas para Bruno Ferreira (cliente_id = 13)
(13, 5.5, 'Rua das Flores, 1500, Centro, Belo Horizonte, MG, Brasil', 'Rua das Flores', '1500', 'Centro', 'Apto 1010', 'Belo Horizonte', 'MG', 'Brasil', -19.919068, -43.938573),

-- Entregas para Camila Dias (cliente_id = 14)
(14, 6.5, 'Rua das Palmeiras, 1600, Savassi, Belo Horizonte, MG, Brasil', 'Rua das Palmeiras', '1600', 'Savassi', 'Apto 1111', 'Belo Horizonte', 'MG', 'Brasil', -19.931674, -43.938573),

-- Entregas para Eduardo Ribeiro (cliente_id = 15)
(15, 7.5, 'Rua das Acácias, 1700, Lourdes, Belo Horizonte, MG, Brasil', 'Rua das Acácias', '1700', 'Lourdes', 'Casa', 'Belo Horizonte', 'MG', 'Brasil', -19.931674, -43.938573),

-- Entregas para Amanda Carvalho (cliente_id = 16)
(16, 8.0, 'Rua das Flores, 1800, Centro, Curitiba, PR, Brasil', 'Rua das Flores', '1800', 'Centro', 'Apto 1212', 'Curitiba', 'PR', 'Brasil', -25.428954, -49.267137),

-- Entregas para Marcos Pinto (cliente_id = 17)
(17, 6.0, 'Rua das Palmeiras, 1900, Batel, Curitiba, PR, Brasil', 'Rua das Palmeiras', '1900', 'Batel', 'Apto 1313', 'Curitiba', 'PR', 'Brasil', -25.442358, -49.279102),

-- Entregas para Isabela Gomes (cliente_id = 18)
(18, 5.0, 'Rua das Acácias, 2000, Água Verde, Curitiba, PR, Brasil', 'Rua das Acácias', '2000', 'Água Verde', 'Casa', 'Curitiba', 'PR', 'Brasil', -25.450396, -49.274005),

-- Entregas para Roberto Nunes (cliente_id = 19)
(19, 7.0, 'Rua das Flores, 2100, Centro, Porto Alegre, RS, Brasil', 'Rua das Flores', '2100', 'Centro', 'Apto 1414', 'Porto Alegre', 'RS', 'Brasil', -30.031118, -51.234435),

-- Entregas para Tatiane Castro (cliente_id = 20)
(20, 6.5, 'Rua das Palmeiras, 2200, Moinhos de Vento, Porto Alegre, RS, Brasil', 'Rua das Palmeiras', '2200', 'Moinhos de Vento', 'Apto 1515', 'Porto Alegre', 'RS', 'Brasil', -30.027704, -51.200495),

-- Entregas para Felipe Mendes (cliente_id = 21)
(21, 5.5, 'Rua das Acácias, 2300, Bela Vista, Porto Alegre, RS, Brasil', 'Rua das Acácias', '2300', 'Bela Vista', 'Casa', 'Porto Alegre', 'RS', 'Brasil', -30.034634, -51.217658),

-- Entregas para Larissa Araújo (cliente_id = 22)
(22, 8.5, 'Rua das Flores, 2400, Centro, Florianópolis, SC, Brasil', 'Rua das Flores', '2400', 'Centro', 'Apto 1616', 'Florianópolis', 'SC', 'Brasil', -27.596904, -48.549564),

-- Entregas para Diego Barbosa (cliente_id = 23)
(23, 7.0, 'Rua das Palmeiras, 2500, Trindade, Florianópolis, SC, Brasil', 'Rua das Palmeiras', '2500', 'Trindade', 'Apto 1717', 'Florianópolis', 'SC', 'Brasil', -27.587800, -48.520508),

-- Entregas para Vanessa Cardoso (cliente_id = 24)
(24, 6.0, 'Rua das Acácias, 2600, Centro, Vitória, ES, Brasil', 'Rua das Acácias', '2600', 'Centro', 'Apto 1818', 'Vitória', 'ES', 'Brasil', -20.319441, -40.337318),

-- Entregas para Gustavo Rocha (cliente_id = 25)
(25, 5.0, 'Rua das Flores, 2700, Praia do Canto, Vitória, ES, Brasil', 'Rua das Flores', '2700', 'Praia do Canto', 'Casa', 'Vitória', 'ES', 'Brasil', -20.297618, -40.295776),

-- Entregas para Renata Moreira (cliente_id = 26)
(26, 7.5, 'Rua das Palmeiras, 2800, Centro, Goiânia, GO, Brasil', 'Rua das Palmeiras', '2800', 'Centro', 'Apto 1919', 'Goiânia', 'GO', 'Brasil', -16.686891, -49.264794),

-- Entregas para Thiago Alves (cliente_id = 27)
(27, 6.5, 'Rua das Acácias, 2900, Setor Marista, Goiânia, GO, Brasil', 'Rua das Acácias', '2900', 'Setor Marista', 'Apto 2020', 'Goiânia', 'GO', 'Brasil', -16.706235, -49.265934),

-- Entregas para Cristina Fernandes (cliente_id = 28)
(28, 5.5, 'Rua das Flores, 3000, Centro, Cuiabá, MT, Brasil', 'Rua das Flores', '3000', 'Centro', 'Apto 2121', 'Cuiabá', 'MT', 'Brasil', -15.601411, -56.097889),

-- Entregas para Alexandre Lima (cliente_id = 29)
(29, 8.0, 'Rua das Palmeiras, 3100, Jardim Aclimação, Cuiabá, MT, Brasil', 'Rua das Palmeiras', '3100', 'Jardim Aclimação', 'Casa', 'Cuiabá', 'MT', 'Brasil', -15.589960, -56.092831),

-- Entregas para Daniela Costa (cliente_id = 30)
(30, 7.0, 'Rua das Acácias, 3200, Centro, Campo Grande, MS, Brasil', 'Rua das Acácias', '3200', 'Centro', 'Apto 2222', 'Campo Grande', 'MS', 'Brasil', -20.469710, -54.620121);
