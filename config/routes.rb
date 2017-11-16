Rails.application.routes.draw do
  scope '/api' do
    get '/portfolios/last-price', to: 'trades#last_price'
    get '/last-index',            to: 'trades#last_index'
    get '/headlines',             to: 'application#headlines'
    resources :portfolios do
      resources :positions, only: [:create, :update, :destroy]
    end
    resources :instruments, only: [:index]
    get '/instruments/refresh', to: 'instruments#refresh_from_feed'
    get '/trades/refresh',      to: 'trades#last_price_bulk_load'
  end
end
