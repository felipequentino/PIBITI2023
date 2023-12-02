# MinhaAju - Crimes Ambientais (MACA)
Repositório oficial da aplicação Foju.

Essa aplicação é resultado de um projeto PIBITI, orientado pelo Prof. Dr. Hendrik T. Macedo e executado pelo discente João F. Quentino. Ambos da Universidade Federal de Sergipe (UFS)
Você pode acessá-la aqui: https://felipequentino.github.io/

## O que é o MACA?
Trata-se de um Progressive Web App Crowdsourcing, onde permite a interação do usuário com o mapa da cidade de Aracaju - SE, e exibe marcadores personalizados de crimes ambientais (desmatamento, queimadas, maus tratos aos animais, poluição, etc) na localização enviada pelo usuário, além do aplicativo possuir um mapa de calor com dados estatísticos acerca dos crimes ambientais ocorridos em Aracaju em 2022 - 2023 (em desenvolvimento).

```{py}
print('teste')
```


## Caracterização e justificativa
Mesmo com todo o potencial tecnológico atual, a cultura de exploração e degradação dos recursos naturais promovida nas sociedades antigas ainda persiste. Com isso, a necessidade de mecanismos que auxiliem no combate contra essas atividades aumenta a cada ano, tendo em vista que a possibilidade de um colapso ambiental mundial se torna maior com o passar do tempo. 

Sabendo da dificuldade e de toda burocracia existente nos portais de denúncia do governo não só brasileiro, mas também de outros países e também da falta de transparência em relação à essas denúncias, este projeto visa implementar um portal de denúncias de crimes ambientais por meio de uma interface user-friendly, simplificando o processo de denúncia e tornando-o intuitivo. 

Este projeto pretende explorar o uso de mapas para produzir um feedback visual a respeito das denúncias cadastradas na aplicação que foram (ou não) solucionadas pelos órgãos competentes. Desta forma, espera-se que além de cadastrar a denúncia, o usuário possa ver a situação atualizada do seu bairro, cidade, estado ou até mesmo país, por meio de um processo de contribuição coletiva dessas denúncias (crowdsourcing).


## Aspectos técnicos:
- Página principal: HTML, CSS, javascript e materialize;
- Dados dos crimes: Providenciado pela Delegacia Especializada em Proteção aos Animais e ao Meio Ambiente (DEPAMA)
- Banco de dados: Firebase Firestore
- Biblioteca usada para gerar o mapa: [Leaflet](https://leafletjs.com/) e [OpenStreetMap](https://www.openstreetmap.org/);
- Plugins usados: [leaflet-heat](https://github.com/Leaflet/Leaflet.heat)
