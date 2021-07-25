class Message < ApplicationRecord
	belongs_to :recording
	has_one_attached :media
end
