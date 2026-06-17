# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.10.1](https://github.com/alexxsouzaa/Kardex/compare/v1.10.0...v1.10.1) (2026-06-17)

## [1.10.0](https://github.com/alexxsouzaa/Kardex/compare/v1.9.0...v1.10.0) (2026-06-17)


### Features

* configurar layout de navegação para fluxo de autenticação ([ce76d58](https://github.com/alexxsouzaa/Kardex/commit/ce76d58a4553b101088b2094e69b7f950c906119))
* implementar contexto global para gerenciamento de depósitos ([b1da2fb](https://github.com/alexxsouzaa/Kardex/commit/b1da2fbb6b4ca310eccfad85c4150983a248474b))
* implementar hook de autenticação (useAuth) ([c4edb61](https://github.com/alexxsouzaa/Kardex/commit/c4edb6133c062834ff34b113a8f51afcd8c1bd73))
* implementar hook de gerenciamento de depósitos ([7eeb0b4](https://github.com/alexxsouzaa/Kardex/commit/7eeb0b4580b2a87c23ba143377b33ffbd6d9acfa))
* implementar onboarding com criação de depósito inicial ([71ca015](https://github.com/alexxsouzaa/Kardex/commit/71ca015dac4b3c57f0b64662839d5d0948c13ff8))
* implementar registro de usuário com integração ao sistema de autenticação ([edf010f](https://github.com/alexxsouzaa/Kardex/commit/edf010ff68445c9bd2e384fdbc95a978f89ab9a5))
* implementar tela de relatórios ([b70a8f9](https://github.com/alexxsouzaa/Kardex/commit/b70a8f99c241b379858be1305a28da3245fd7c05))


### Bug Fixes

* corrige avisos de imagens no Expo ([565c7b2](https://github.com/alexxsouzaa/Kardex/commit/565c7b28984104410b3e37e26958a94dc52191a6))
* persistencia de imagens e carrossel em tela cheia - Criado utils/persistImage.ts para copiar imagens do cache para diretorio permanente - Integrado persistencia no useProductMutations (create e update) - Integrado persistencia no ProductImagesSection (galeria, camera e troca) - Corrigido limite maxPhotos do plano free de 1 para 5 - Migrado expo-file-system para import legacy (SDK 54) ([fe291af](https://github.com/alexxsouzaa/Kardex/commit/fe291afd2c866e16c6569bb18784c402a3982ce7))

## [1.9.0](https://github.com/alexxsouzaa/Kardex/compare/v1.8.0...v1.9.0) (2026-03-19)


### Features

* adicionar AuthContext com Supabase, roles e planos ([dd142b0](https://github.com/alexxsouzaa/Kardex/commit/dd142b0159a11c32b6b248249c967d537090ce46))
* adicionar constantes de limites por plano (free/pro) ([32097fb](https://github.com/alexxsouzaa/Kardex/commit/32097fbd1a6422ab2e31c2d1ebc2d9eb5039b652))
* adicionar guard de autenticação no index ([5ffc1e6](https://github.com/alexxsouzaa/Kardex/commit/5ffc1e69429480cf4d35871b7dcef14a3c88b261))
* adicionar hook useMovements para registrar movimentações ([a2920dd](https://github.com/alexxsouzaa/Kardex/commit/a2920dd59202d234474c8f84af116fb18e685ccf))
* adicionar hook usePlan para verificar limites do plano ([31a9eb0](https://github.com/alexxsouzaa/Kardex/commit/31a9eb0f9804082a51f0d8e953a6e5c41132e677))
* adicionar hook useProduct para produto individual ([e15d832](https://github.com/alexxsouzaa/Kardex/commit/e15d8320530844160d7dee16ca4dd31d7e91aa18))
* adicionar hook useProduct para produto individual ([1a8abd9](https://github.com/alexxsouzaa/Kardex/commit/1a8abd94ba00339464fec4f3441270faf64e1509))
* adicionar hook useProductMutations com criar, editar e deletar ([3ef1159](https://github.com/alexxsouzaa/Kardex/commit/3ef1159493af8da0b4a0baa257380a45eb7371c4))
* adicionar hook useProducts com filtros, busca e ordenação ([0bd2693](https://github.com/alexxsouzaa/Kardex/commit/0bd2693486027a0dfff4082e0bfd16d690b605d1))
* adicionar tela de opções com perfil, configurações e logout ([b022b45](https://github.com/alexxsouzaa/Kardex/commit/b022b4597e5fb9dbdd11526d66ebdde98e0ffaa7))
* adicionar telas de login, cadastro e onboarding ([819be5f](https://github.com/alexxsouzaa/Kardex/commit/819be5f405742f24c6519357eea338cc31dc6aeb))
* configurar WatermelonDB com schema, models e migrations ([f9ebbb0](https://github.com/alexxsouzaa/Kardex/commit/f9ebbb00aae0e75bdb59a9b101d3a67b9b0d86ab))

## [1.8.0](https://github.com/alexxsouzaa/Kardex/compare/v1.7.0...v1.8.0) (2026-03-16)


### Features

* adicionar CategoryModal com gesto de arrastar para fechar e ícones por categoria ([8220481](https://github.com/alexxsouzaa/Kardex/commit/8220481a7c9d84f2212167ffdba232e971b4285d))
* adicionar SortModal com gesto de arrastar para fechar e animação suave ([61e5ed2](https://github.com/alexxsouzaa/Kardex/commit/61e5ed2ea2d1636acc4504338d9fb2330b4b887b))
* adicionar tokens de cores centralizados em colors.ts ([93fbef8](https://github.com/alexxsouzaa/Kardex/commit/93fbef8255810c5e991df5a415ab3da31bfee92b))

## [1.7.0](https://github.com/alexxsouzaa/Kardex/compare/v1.5.0...v1.7.0) (2026-03-10)


### Features

* adicionar avatar do usuário ([acbc4f7](https://github.com/alexxsouzaa/Kardex/commit/acbc4f7d84c703c780853c77ffeb59b60b426a5b))
* adicionar componente FilterTabs ([a16f12d](https://github.com/alexxsouzaa/Kardex/commit/a16f12d1a59ba5aac5a112c10f492ea7477aa99c))
* adicionar componente IconButton ([b2353f3](https://github.com/alexxsouzaa/Kardex/commit/b2353f3b8b70f886f222ed4383c6ba4c4960bfb5))
* adicionar configuração de fontes ([408b111](https://github.com/alexxsouzaa/Kardex/commit/408b111a3b576cfe25ecf2bee04486ba6c876b71))
* adicionar imagem do card da tela inicial ([284d6dc](https://github.com/alexxsouzaa/Kardex/commit/284d6dc9f04ae0f59068f641e634ea06e76e6e76))
* adicionar tela de cadastro ([a4689e8](https://github.com/alexxsouzaa/Kardex/commit/a4689e80d98c9d192dc1f6f1407c5ddd2505cb27))
* adicionar tela de controle de estoque ([9ec78ba](https://github.com/alexxsouzaa/Kardex/commit/9ec78bad63c023ba69bef79ea572e830afd7751e))
* adicionar tela de relatórios ([95864b3](https://github.com/alexxsouzaa/Kardex/commit/95864b30dd85b7f3e6c752cc4b93bd928fd0f0e4))

### [1.6.1](https://github.com/alexxsouzaa/Kardex/compare/v1.6.0...v1.6.1) (2026-03-10)

## [1.6.0](https://github.com/alexxsouzaa/Kardex/compare/v1.4.0...v1.6.0) (2026-03-10)


### Features

* adicionar avatar do usuário ([b875bc0](https://github.com/alexxsouzaa/Kardex/commit/b875bc08d1add6dcf4a878ebae427d5bb594766e))
* adicionar componente FilterTabs ([84f2d85](https://github.com/alexxsouzaa/Kardex/commit/84f2d851d35a4c8f8af917299f5d0b48eca23b56))
* adicionar componente IconButton ([5aae7cd](https://github.com/alexxsouzaa/Kardex/commit/5aae7cd7cd2bb924af390e0c11531cdc14d5fdb9))
* adicionar componente ModuleCard ([e6452eb](https://github.com/alexxsouzaa/Kardex/commit/e6452eb7a026d3381427559b9e7193a603f855d9))
* adicionar configuração de fontes ([6c63833](https://github.com/alexxsouzaa/Kardex/commit/6c638336c46d3ad55dc95152b5cb8ffb7fd66637))
* adicionar imagem do card da tela inicial ([300a9ef](https://github.com/alexxsouzaa/Kardex/commit/300a9efbcb1d5bbbc837fd1142350000ac328533))
* adicionar tela de cadastro ([741124c](https://github.com/alexxsouzaa/Kardex/commit/741124c59a05d5dd0aa9d195a56b5beb41514fd5))
* adicionar tela de controle de estoque ([af9933c](https://github.com/alexxsouzaa/Kardex/commit/af9933c3e638e0038483d60ca3d90a2f75d62c29))
* adicionar tela de relatórios ([cef1ff0](https://github.com/alexxsouzaa/Kardex/commit/cef1ff0aa897e2dd5c846f2632c41d6fd3a20c48))

## [1.5.0](https://github.com/alexxsouzaa/Kardex/compare/v1.4.0...v1.5.0) (2026-03-04)


### Features

* adicionar componente ModuleCard ([e6452eb](https://github.com/alexxsouzaa/Kardex/commit/e6452eb7a026d3381427559b9e7193a603f855d9))

## [1.4.0](https://github.com/alexxsouzaa/Kardex/compare/v1.3.0...v1.4.0) (2026-03-04)


### Features

* adicionar componente TextButton ([99d9c17](https://github.com/alexxsouzaa/Kardex/commit/99d9c1766053606cdc7f55b187997b318a0484a3))

## [1.3.0](https://github.com/alexxsouzaa/Kardex/compare/v1.2.0...v1.3.0) (2026-03-03)


### Features

* adicionar componente CardBanner com imagem e textos ([5af4735](https://github.com/alexxsouzaa/Kardex/commit/5af47358eef8041797cdf793b63aa5d919895bf3))

## [1.2.0](https://github.com/alexxsouzaa/Kardex/compare/v1.1.0...v1.2.0) (2026-03-03)


### Features

* adiciona componente IconButton ([df57ed5](https://github.com/alexxsouzaa/Kardex/commit/df57ed5a87118d7d3a1403dca1856a1347ba8b9f))
* **ui:** cria componente Header com avatar e saudação ([73451d9](https://github.com/alexxsouzaa/Kardex/commit/73451d99e1fcbca03e15f9b1d43ee24714d33dec))

## 1.1.0 (2026-03-02)


### Features

* adiciona dashboard ([65b772c](https://github.com/alexxsouzaa/Kardex/commit/65b772c2daccb3ec3fbfd258395bbee059c29798))
* setup versionamento automatico ([28390d5](https://github.com/alexxsouzaa/Kardex/commit/28390d55506240b7ebfc9abd770a33a908ea1df2))
