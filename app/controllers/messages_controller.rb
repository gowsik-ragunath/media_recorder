class MessagesController < ApplicationController
	def new
		@message = Message.new
	end

	def create
	end

	def show
		@message = Message.find(params[:id])
	end
end
