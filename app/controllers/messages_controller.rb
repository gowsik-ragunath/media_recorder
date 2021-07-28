class MessagesController < ApplicationController
	def new
		@message = Message.new
	end

	def create
		@message = Message.new(message_params)

		respond_to do |format|
			if @message.save
				format.html { redirect_to recording_path(@message.recording_id) }
			else
				format.html { redirect_to action: 'new' }
			end
		end	
	end

	def show
		@message = Message.find(params[:id])
	end

	private

		def message_params
			params.require(:message).permit(:media, :recording_id)
		end
end
