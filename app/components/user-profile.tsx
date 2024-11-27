import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

interface UserProfileProps {
  name: string
  betsWon: number
  betsLost: number
  activeBets: number
}

export const UserProfile = ({ name, betsWon, betsLost, activeBets }: UserProfileProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
  }

  return (
    <div className="pt-20">
      <Card className="border-none shadow-none">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage 
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`}
                alt={`${name}'s avatar`}
              />
              <AvatarFallback>{getInitials(name)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{name}</h2>
              <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
                <div>
                  <span className="font-medium text-green-600">{betsWon}</span> Won
                </div>
                <div>
                  <span className="font-medium text-red-600">{betsLost}</span> Lost
                </div>
                <div>
                  <span className="font-medium text-blue-600">{activeBets}</span> Active
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 