# 🌩️ StormsTrack

StormsTrack é uma solução IoT voltada ao **monitoramento de calor extremo em áreas urbanas**, desenvolvida para auxiliar na prevenção de riscos ambientais e proteger populações vulneráveis. O sistema integra sensores físicos, envio de dados em tempo real e um aplicativo mobile para gestão e visualização das informações coletadas.

---

## 🔍 Descrição do Projeto

StormsTrack tem como objetivo:

- Monitorar variáveis ambientais como **temperatura, umidade e luminosidade**;
- Coletar e exibir dados em **tempo real** através de uma API e dashboards;
- Enviar **alertas preventivos** em caso de risco térmico elevado;
- Propor **zonas de resfriamento** para mitigar os efeitos do calor.

---

## 📱 Funcionalidades do App Mobile

- 📌 Cadastro e login de usuários
- 🌡️ Visualização de sensores e seus dados
- ⚠️ Criação e exibição de alertas manuais
- 📍 Dashboard com dados dos sensores em tempo real (conectado à API)
- 🛠️ Tela de registro de sensores

---

## 🧠 Tecnologias Utilizadas

### Frontend (Mobile):
- [React Native](https://reactnative.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Expo](https://expo.dev/)
- Axios (requisições HTTP)
- Componentes de UI customizados

### Backend/API:
- Simulação HTTP com sensores (JSON via `inject`)
- Dashboards interativos para monitoramento

---

## ⚙️ Como Executar

### 1. Mobile App

```bash
# Instale as dependências
cd storms-app
npm install

# Rode o app com Expo
npx expo start
```
### 
