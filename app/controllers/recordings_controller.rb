class RecordingsController < ApplicationController
	def index
		@recordings = Recording.all
	end

	def new
		redirect_to controller: 'recordings', action: 'create'	
	end

	def create
		@recording = Recording.new

		respond_to do |format|
			if @recording.save
				format.html { redirect_to action: "show", id: @recording.id }
			else
				format.html { redirect_to action: 'index' }
			end
		end
	end

	def show
		@recording = Recording.find(params[:id])

		@messages = @recording.messages
	end
end
