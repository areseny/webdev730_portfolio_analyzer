class PositionSerializer < ActiveModel::Serializer
  attributes :id, :portfolio_id, :instrument, :quantity, :cost, :date_acquired
  belongs_to :portfolio
  belongs_to :instrument
end
