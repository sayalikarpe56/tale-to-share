-- Create enum for connection status
CREATE TYPE public.connection_status AS ENUM ('pending', 'accepted', 'rejected');

-- Create connections table for friend requests and followers
CREATE TABLE public.connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID NOT NULL,
  following_id UUID NOT NULL,
  status connection_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Enable RLS
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Connections are viewable by involved users"
ON public.connections
FOR SELECT
USING (
  auth.uid() = follower_id OR 
  auth.uid() = following_id OR
  status = 'accepted'
);

CREATE POLICY "Users can create connection requests"
ON public.connections
FOR INSERT
WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can update their received requests"
ON public.connections
FOR UPDATE
USING (auth.uid() = following_id);

CREATE POLICY "Users can delete their own requests"
ON public.connections
FOR DELETE
USING (auth.uid() = follower_id OR auth.uid() = following_id);

-- Create trigger for updated_at
CREATE TRIGGER update_connections_updated_at
BEFORE UPDATE ON public.connections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_connections_follower ON public.connections(follower_id);
CREATE INDEX idx_connections_following ON public.connections(following_id);
CREATE INDEX idx_connections_status ON public.connections(status);